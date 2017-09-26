module.exports = {
	description: 'Base command for tags',
	category: 'Utils',
	args: '(name) [args] | add (name) (content..) | edit (name) (content..) | delete (name) | raw (name) | owner (name) | list [user]',
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

				let userID = message.author.id;

				if (args[1]) {
					const match = this.utils.getMemberFromString(message, args[1]);
					if (match) userID = match.user.id;
				}

				const tags = await this.utils.queryDB('SELECT name FROM tags WHERE userid = $1', [userID]);

				const embed = new this.api.MessageEmbed();

				embed.setTitle(`${this.client.users.has(userID) ? this.client.users.get(userID).tag : 'Unknown User#0000'}'s Tags`);
				embed.setDescription(tags.rows.map(r => r.name.includes(' ') ? `"${r.name}"` : r.name).join('\n') || 'This user made no tags');
				embed.setColor(0xff3366);

				message.channel.send({
					embed
				});

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
