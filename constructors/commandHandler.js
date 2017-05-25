class CommandHandler {
	constructor(bot) {
		this.bot = bot;
	}

	registerHandler() {
		this.bot.client.on('message', (message) => {
			if(!message.content.startsWith(this.bot.botCfg.prefix)) return;
			if(message.author.bot || message.author.id === this.bot.client.id || message.channel.type === 'dm') return;

			const messageArguments = message.content.replace(this.bot.botCfg.prefix, '').split(' ');
			const commandName = messageArguments.shift();

			if(!this.bot.commands.has(commandName)) return;

			this.bot.db.connect((err, cli, done) => {
				if(err) return this.bot.utils.handleCommandError(err, message, done);

				cli.query('SELECT * FROM blacklists WHERE (type = \'server\' AND id = $1) OR (type = \'channel\' AND id = $2) OR (type = \'user\' AND id = $3)', [message.guild.id, message.channel.id, message.author.id], (err, res) => {
					if(err) return this.bot.utils.handleCommandError(err, message, done);
					if(res.rowCount > 0) return done();

					let command = this.bot.commands.get(commandName);
					if(command.alias) command = this.bot.commands.get(command.name);
					if(command.adminOnly && !this.bot.botCfg.admins.includes(message.author.id)) return void message.channel.send(':x: Sorry, but you don\'t have permission to use this command');

					if(this.bot.commandCooldowns.has(message.author.id)) {

						const cooldowns = this.bot.commandCooldowns.get(message.author.id);

						if(cooldowns.has(command.name)) {
							const expirationTime = cooldowns.get(command.name);
							const timeRemaining = Math.ceil((expirationTime - Date.now()) / 1000);

							if(Date.now() < expirationTime) return void message.channel.send(`:x: Cooldown! Please wait another ${timeRemaining} ${timeRemaining === 1 ? 'second' : 'seconds'} before using this command`);
						}

						cooldowns.set(command.name, Date.now() + command.cooldown);

					} else {
						const cooldowns = new this.bot.api.Collection();

						cooldowns.set(command.name, Date.now() + command.cooldown);

						this.bot.commandCooldowns.set(message.author.id, cooldowns);
					}

					const unsplitArgs = messageArguments.join(' ');
					const splitArgs = this.splitArguments(unsplitArgs);

					try {
						command.run.call(this.bot, message, splitArgs, unsplitArgs);
					} catch(err) {
						this.bot.utils.handleCommandError(err, message);
					}

				});

			});

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

	invalidArguments(message) {

		const messageArguments = message.content.replace(this.bot.botCfg.prefix, '').split(' ');
		const commandName = messageArguments.shift();
		let command = this.bot.commands.get(commandName);
		if(command.alias) command = this.bot.commands.get(command.name);

		message.channel.send(`Invalid arguments! Try:\n\`\`\`\n${this.bot.botCfg.prefix}${commandName} ${command.args || ''}\`\`\``);

	}

}

module.exports = CommandHandler;
