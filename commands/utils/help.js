module.exports = {
	description: 'Sends command help',
	category: 'Utils',
	args: '[command]',
	cooldown: 1000,
	run: async function(message, args) {

		if(args.length === 1) {

			const commandName = args[0];
			if(!this.commands.has(commandName.toLowerCase())) return message.channel.send('That command doesn\'t exist, try another one!');
			let command = this.commands.get(commandName.toLowerCase());
			if(command.alias) command = this.commands.get(command.name);

			message.channel.send(`+ ${this.botCfg.prefix}${commandName.toLowerCase()}\n- ${command.description}\n\n- Usage:\n- ${this.botCfg.prefix}${commandName.toLowerCase()} ${command.args || ''}`, {
				code: 'diff'
			});

		} else message.channel.send('You can find a lost of commands here:\n<https://fbot.menchez.me/>');

	}
};
