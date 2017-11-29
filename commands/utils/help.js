module.exports = {
	description: 'Sends command help',
	category: 'Utils',
	args: '[command]',
	cooldown: 1000,
	run: async function (message, args) {
		if (args.length === 1) {
			const commandName = args[0];
			if (!this.commands.has(commandName.toLowerCase())) return message.channel.send('That command doesn\'t exist, try another one!');
			let command = this.commands.get(commandName.toLowerCase());
			if (command.alias) command = this.commands.get(command.name);

			message.channel.send(`# ${this.botCfg.prefix}${commandName}\n- ${command.description}\n\n- Usage:\n- ${this.botCfg.prefix}${commandName} ${command.args || ''}`, {
				code: 'md'
			});
		} else message.channel.send('You can find a list of commands here:\n<https://gist.github.com/matmen/8485d47f593167813cd8db67763c57c3/>');
	}
};
