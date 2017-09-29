class CommandHandler {
	constructor(bot) {
		this.bot = bot;
	}

	async handleMessage(message) {
		if (message.author.bot) return;

		if (!this.bot.utils.isAdmin(message.author.id)) {
			const isBlacklisted = await this.bot.utils.queryDB('SELECT FROM blacklists WHERE (type = \'server\' AND id = $1) OR (type = \'channel\' AND id = $2) OR (type = \'user\' AND id = $3)', [message.guild ? message.guild.id : message.channel.id, message.channel.id, message.author.id]);
			if (isBlacklisted.rowCount > 0) return;
		}

		this.handleAutoreactions(message);

		const mentionRegex = new RegExp(`^<@!?${this.bot.client.user.id}>`);
		let prefix = this.bot.botCfg.prefix;

		if (message.guild) {
			const prefixResult = await this.bot.utils.queryDB('SELECT value FROM settings WHERE setting = $1 AND server = $2', ['prefix', message.guild.id]);
			if (prefixResult.rowCount > 0) prefix = prefixResult.rows[0].value;
		}

		if (!message.content.startsWith(prefix) && !mentionRegex.test(message.content)) return;

		const messageArguments = (mentionRegex.test(message.content) ? message.content.replace(mentionRegex, '') : message.content.replace(prefix, '')).replace(/^ +/g, '').split(/ +/g);
		let commandName = messageArguments.shift();

		if (!commandName) return;
		commandName = commandName.toLowerCase();

		if (!this.bot.commands.has(commandName)) return;
		if (message.guild && !message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return message.author.send('Sorry, but I don\'t have permission to post in that channel!');
		if (message.guild && !message.channel.permissionsFor(message.guild.me).has('ATTACH_FILES')) return message.channel.send('Sorry, but I probably need the Attach Files permission to handle this command properly!');

		let command = this.bot.commands.get(commandName);
		if (command.alias) command = this.bot.commands.get(command.name);
		if (command.adminOnly && !this.bot.utils.isAdmin(message.author.id)) return void message.channel.send(':x: Sorry, but you don\'t have permission to use this command');

		if (!this.bot.utils.isAdmin(message.author.id)) {
			if (this.bot.commandCooldowns.has(message.author.id)) {

				const cooldowns = this.bot.commandCooldowns.get(message.author.id);

				if (cooldowns.has(command.name)) {
					const expirationTime = cooldowns.get(command.name);
					const timeRemaining = Math.ceil((expirationTime - Date.now()) / 1000) * 1000;

					if (Date.now() < expirationTime) {
						if (!cooldowns.has('handler:cooldown') || Date.now() > cooldowns.get('handler:cooldown')) message.channel.send(`:x: Cooldown! Please wait another ${this.bot.hd(timeRemaining)} before using this command`);
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

		this.bot.utils.queryDB('INSERT INTO commands VALUES ($1, $2, $3, $4, $5)', [message.id, command.name, message.author.id, message.channel.id, message.guild ? message.guild.id : message.channel.id]);
	}

	async handleAutoreactions(message) {
		if (message.guild) {
			const disabled = await this.bot.utils.queryDB('SELECT value FROM settings WHERE server = $1 AND setting = $2 AND value = \'true\'', [message.guild.id, 'disableAutoreact']);
			if (disabled.rowCount > 0) return;
		}

		let text = message.content.toLowerCase();

		if (text === 'ok') await message.react('🆗');

		if (/y\/n(\?)?$/.test(text)) {
			await message.react('🔼');
			await message.react('🔽');
		}

		if (text.includes('🤔')) await message.react('🤔');

		if (/\blit\b/.test(text)) await message.react('🔥');

		if (/\bpress f\b/.test(text)) await message.react('🇫');

		if (/\bsnek\b/.test(text)) await message.react('🐍');

		if (/\bmurica\b/.test(text)) await message.react('🇺🇸');

		if (/\bheil\b/.test(text)) await message.react('🇩🇪');

		if (/^add fbot to your( discord)? server at fbot\.menchez\.me$/.test(text)) message.channel.send(message.content);

		if (text.includes('machine broke')) message.channel.send('understandable, have a nice day');
	}

	registerHandler() {
		this.bot.client.on('message', (message) => {
			this.handleMessage(message);
		});

		this.bot.client.on('messageUpdate', (oldMessage, newMessage) => {
			if (oldMessage.content === newMessage.content) return;
			this.handleMessage(newMessage);
		});
	}

	splitArguments(string) {
		const splitArguments = string.trim().split('');

		const args = [];
		let inMultiwordArg = false;
		let currentArg = '';

		for (const char of splitArguments) {

			if (char === '"') {
				inMultiwordArg = !inMultiwordArg;
			} else if (char === ' ' && !inMultiwordArg && currentArg) {
				args.push(currentArg);
				currentArg = '';
			} else if (char !== ' ' || inMultiwordArg) currentArg += char;

		}

		if (currentArg) args.push(currentArg);

		return args;
	}

	async invalidArguments(message) {
		const mentionRegex = new RegExp(`^<@!?${this.bot.client.user.id}> `);
		let prefix = this.bot.botCfg.prefix;

		if (message.guild) {
			const prefixResult = await this.bot.utils.queryDB('SELECT value FROM settings WHERE setting = $1 AND server = $2', ['prefix', message.guild.id]);
			if (prefixResult.rowCount > 0) prefix = prefixResult.rows[0].value;
		}

		const messageArguments = (mentionRegex.test(message.content) ? message.content.replace(mentionRegex, '') : message.content.replace(prefix, '')).replace(/^ +/g, '').split(/ +/g);
		const commandName = messageArguments.shift().toLowerCase();
		let command = this.bot.commands.get(commandName);
		if (command.alias) command = this.bot.commands.get(command.name);

		message.channel.send(`Invalid arguments! Try:\n\`\`\`\n${prefix}${commandName} ${command.args || ''}\`\`\``);
	}

}

module.exports = CommandHandler;
