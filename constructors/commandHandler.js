class CommandHandler {
	constructor(bot) {
		this.bot = bot;
	}

	registerHandler() {
		this.bot.client.on('message', async(message) => {
			if(message.author.bot || message.author.id === this.bot.client.id) return;
			if(message.channel.type === 'dm') return message.channel.send('Sorry, but commands cannot be executed via DM!');

			const mentionRegex = new RegExp(`^<@!?${this.bot.client.user.id}> `);
			const prefixResult = await this.bot.utils.queryDB('SELECT value FROM settings WHERE setting = $1 AND server = $2', ['prefix', message.guild.id]);
			const prefix = prefixResult.rowCount > 0 ? prefixResult.rows[0].value : this.bot.botCfg.prefix;

			if(!message.content.startsWith(prefix) && !message.content.match(mentionRegex)) return;

			const messageArguments = (message.content.match(mentionRegex) ? message.content.replace(mentionRegex, '') : message.content.replace(prefix, '')).split(/ +/g);
			const commandName = messageArguments.shift();

			if(!this.bot.commands.has(commandName)) return;
			if(!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return message.author.send('Sorry, but I don\'t have permission to post in that channel!');


			const isBlacklisted = await this.bot.utils.queryDB('SELECT * FROM blacklists WHERE (type = \'server\' AND id = $1) OR (type = \'channel\' AND id = $2) OR (type = \'user\' AND id = $3)', [message.guild.id, message.channel.id, message.author.id]);
			if(isBlacklisted.rowCount > 0) return;

			let command = this.bot.commands.get(commandName);
			if(command.alias) command = this.bot.commands.get(command.name);
			if(command.adminOnly && !this.bot.botCfg.admins.includes(message.author.id)) return void message.channel.send(':x: Sorry, but you don\'t have permission to use this command');

			if(!this.bot.utils.isAdmin(message.author.id)) {
				if(this.bot.commandCooldowns.has(message.author.id)) {

					const cooldowns = this.bot.commandCooldowns.get(message.author.id);

					if(cooldowns.has(command.name)) {
						const expirationTime = cooldowns.get(command.name);
						const timeRemaining = Math.ceil((expirationTime - Date.now()) / 1000) * 1000;

						if(Date.now() < expirationTime) {
							if(!cooldowns.has('handler:cooldown') || Date.now() > cooldowns.get('handler:cooldown')) message.channel.send(`:x: Cooldown! Please wait another ${this.bot.hd(timeRemaining)} before using this command`);
							return cooldowns.set('handler:cooldown', Date.now() + 5000);
						}
					}

					cooldowns.set(command.name, Date.now() + command.cooldown);

				} else {
					const cooldowns = new this.bot.api.Collection();

					cooldowns.set(command.name, Date.now() + command.cooldown);

					this.bot.commandCooldowns.set(message.author.id, cooldowns);
				}
			}

			const unsplitArgs = messageArguments.join(' ');
			const splitArgs = this.splitArguments(unsplitArgs);

			message.channel.startTyping();
			message.channel.stopTyping(true);

			command.run.call(this.bot, message, splitArgs, unsplitArgs).catch((err) => {
				this.bot.utils.handleCommandError(err, message);
			});

			this.bot.utils.queryDB('INSERT INTO commands VALUES ($1, $2, $3, $4, $5)', [message.id, command.name, message.author.id, message.channel.id, message.guild.id]);

		});
	}

	splitArguments(string) {
		const splitArguments = string.trim().split('');

		const args = [];
		let inMultiwordArg = false;
		let currentArg = '';

		for(const char of splitArguments) {

			if(char === '"') {
				inMultiwordArg = !inMultiwordArg;
			} else if(char === ' ' && !inMultiwordArg && currentArg) {
				args.push(currentArg);
				currentArg = '';
			} else if(char !== ' ' || inMultiwordArg) currentArg += char;

		}

		if(currentArg) args.push(currentArg);

		return args;
	}

	async invalidArguments(message) {

		const prefixResult = await this.bot.utils.queryDB('SELECT value FROM settings WHERE setting = $1 AND server = $2', ['prefix', message.guild.id]);
		const prefix = prefixResult.rowCount > 0 ? prefixResult.rows[0].value : this.bot.botCfg.prefix;
		const messageArguments = message.content.replace(prefix, '').split(' ');
		const commandName = messageArguments.shift();
		let command = this.bot.commands.get(commandName);
		if(command.alias) command = this.bot.commands.get(command.name);

		message.channel.send(`Invalid arguments! Try:\n\`\`\`\n${prefix}${commandName} ${command.args || ''}\`\`\``);

	}

}

module.exports = CommandHandler;
