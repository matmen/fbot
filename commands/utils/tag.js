module.exports = {
	description: 'Base command for tags',
	category: 'Utils',
	args: '(name) [args] | add (name) (content..) | edit (name) (content..) | rename (name) (newName) | gift (name) (newOwner) | delete (name) | raw (name) | owner (name) | list [user]',
	aliases: ['t'],
	cooldown: 1000,
	run: async function (message, args) {
		if (args.length === 0) return this.commandHandler.invalidArguments(message);

		if (['add', 'create'].includes(args[0].toLowerCase())) {

			if (args.length < 3) return this.commandHandler.invalidArguments(message);

			const name = args[1].toLowerCase();
			const content = args.splice(2, args.length).join(' ');

			const tags = await this.utils.queryDB('SELECT content FROM tags WHERE name = $1', [name]);
			if (tags.rowCount > 0) return message.channel.send(`:x: Tag **${name}** already exists!`);
			await this.utils.queryDB('INSERT INTO tags VALUES ($1, $2, $3)', [name, content, message.author.id]);
			message.channel.send(`:white_check_mark: Created tag **${name}**!`);

		} else if (args[0].toLowerCase() === 'edit') {

			if (args.length < 3) return this.commandHandler.invalidArguments(message);

			const name = args[1].toLowerCase();
			const content = args.splice(2, args.length).join(' ');

			const tag = await this.utils.queryDB('SELECT userid FROM tags WHERE name = $1', [name]);
			if (tag.rowCount < 1) return message.channel.send(`:x: Tag **${name}** not found!`);
			if (!this.utils.isAdmin(message.author.id) && message.author.id !== tag.rows[0].userid) return message.channel.send(':x: You don\'t own that tag!');

			await this.utils.queryDB('UPDATE tags SET content = $2 WHERE name = $1', [name, content]);
			message.channel.send(`:pencil: Updated tag **${name}**`);

		} else if (args[0].toLowerCase() === 'rename') {

			if (args.length < 3) return this.commandHandler.invalidArguments(message);

			const name = args[1].toLowerCase();

			const tag = await this.utils.queryDB('SELECT userid FROM tags WHERE name = $1', [name]);
			if (tag.rowCount < 1) return message.channel.send(`:x: Tag **${name}** not found!`);
			if (!this.utils.isAdmin(message.author.id) && message.author.id !== tag.rows[0].userid) return message.channel.send(':x: You don\'t own that tag!');

			const newName = args[2].toLowerCase();

			await this.utils.queryDB('UPDATE tags SET name = $2 WHERE name = $1', [name, newName]);
			message.channel.send(`:pencil: Renamed tag **${name}** to **${newName}**`);

		} else if (args[0].toLowerCase() === 'gift') {

			if (args.length < 3) return this.commandHandler.invalidArguments(message);

			const name = args[1].toLowerCase();
			let user = message.author;

			if (args[2]) {
				const match = this.utils.getMemberFromString(message, args[2]);
				if (match) user = match.user;
			}

			const tag = await this.utils.queryDB('SELECT userid FROM tags WHERE name = $1', [name]);
			if (tag.rowCount < 1) return message.channel.send(`:x: Tag **${name}** not found!`);
			if (!this.utils.isAdmin(message.author.id) && message.author.id !== tag.rows[0].userid) return message.channel.send(':x: You don\'t own that tag!');

			if (user.id === message.author.id) return message.channel.send(':x: You cant gift tags to yourself!');
			if (user.id === this.client.user.id) return message.channel.send(':x: You cant gift tags to me!');

			await this.utils.queryDB('UPDATE tags SET userid = $2 WHERE name = $1', [name, user.id]);
			message.channel.send(`:gift: Gifted tag **${name}** to **${user.tag}**`);

		} else if (['delete', 'remove'].includes(args[0].toLowerCase())) {

			if (args.length < 2) return this.commandHandler.invalidArguments(message);

			const name = args.splice(1, args.length).join(' ').toLowerCase();

			const tag = await this.utils.queryDB('SELECT userid FROM tags WHERE name = $1', [name]);
			if (tag.rowCount < 1) return message.channel.send(`:x: Tag **${name}** not found!`);
			if (!this.utils.isAdmin(message.author.id) && message.author.id !== tag.rows[0].userid) return message.channel.send(':x: You don\'t own that tag!');

			await this.utils.queryDB('DELETE FROM tags WHERE name = $1', [name]);
			message.channel.send(`:wastebasket: Deleted tag **${name}**`);

		} else if (['raw', 'view'].includes(args[0].toLowerCase())) {

			if (args.length < 2) return this.commandHandler.invalidArguments(message);

			const name = args[1].toLowerCase();

			const tag = await this.utils.queryDB('SELECT content FROM tags WHERE name = $1', [name]);
			if (tag.rowCount < 1) return message.channel.send(`:x: Tag **${name}** not found!`);

			message.channel.send(tag.rows[0].content, {
				code: true
			});

		} else if (args[0].toLowerCase() === 'owner') {

			if (args.length < 2) return this.commandHandler.invalidArguments(message);

			const name = args.splice(1, args.length).join(' ').toLowerCase();

			const tag = await this.utils.queryDB('SELECT userid FROM tags WHERE name = $1', [name]);
			if (tag.rowCount < 1) return message.channel.send(`:x: Tag **${name}** not found!`);

			const userID = tag.rows[0].userid;

			message.channel.send(`:bust_in_silhouette: Tag **${name}** is owned by **${this.client.users.has(userID) ? this.client.users.get(userID).tag : 'Unknown User#0000'}**`);

		} else if (args[0].toLowerCase() === 'list') {

			if (args[1] === 'all') {

				const tags = await this.utils.queryDB('SELECT name FROM tags');

				message.channel.send(`All tags (\`${tags.rowCount}\`):`, {
					files: [{
						attachment: Buffer.from(tags.rows.map(r => r.name).join('\n'), 'utf-8'),
						name: 'alltags.txt'
					}]
				});

			} else {

				let user = message.author;

				if (args[1]) {
					const match = this.utils.getMemberFromString(message, args[1]);
					if (match) user = match.user;
				}

				const tags = await this.utils.queryDB('SELECT name FROM tags WHERE userid = $1', [user.id]);

				const tagList = tags.rows.map(r => r.name.includes(' ') ? `"${r.name}"` : r.name).join('\n') || 'This user made no tags';

				if (tagList.length > 2048) {

					message.channel.send(`\`${user.tag}\`'s tags (\`${tags.rowCount}\`):`, {
						files: [{
							attachment: Buffer.from(tagList, 'utf-8'),
							name: `tags-${user.username}-${user.discriminator}.txt`
						}]
					});

				} else {
					const embed = new this.api.MessageEmbed();

					embed.setTitle(`${user.tag}'s Tags`);
					embed.setDescription(tagList);
					embed.setColor(0xff3366);

					message.channel.send({
						embed
					});
				}

			}

		} else if (args[0].toLowerCase() === 'dump') {

			let user = message.author;

			if (args[1]) {
				const match = this.utils.getMemberFromString(message, args[1]);
				if (match) user = match.user;
			}

			const tags = await this.utils.queryDB('SELECT name, content FROM tags WHERE userid = $1', [user.id]);

			message.channel.send(`Tag dump for \`${user.tag}\` (\`${tags.rowCount}\` Tags):`, {
				files: [{
					attachment: Buffer.from(JSON.stringify(tags.rows, null, 4), 'utf-8'),
					name: `tagdump-${user.username}-${user.discriminator}.json`
				}]
			});

		} else {

			const name = args[0].toLowerCase();

			const tag = await this.utils.queryDB('SELECT content FROM tags WHERE name = $1', [name]);
			if (tag.rowCount < 1) return message.channel.send(`:x: Tag **${name}** not found!`);

			const parsed = this.utils.parseTag(tag.rows[0].content, message, args.splice(1, args.length));

			message.channel.send(this.utils.filterMentions(parsed));

		}

	}
};
