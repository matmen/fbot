module.exports = {
	description: 'Reloads all commands',
	category: 'Botadmin',
	cooldown: 1000,
	adminOnly: true,
	run: function(message) {

		const startTime = Date.now();

		this.commands = this.resourceLoader.loadCommands();

		message.channel.send(`:white_check_mark: Reloaded ${this.commands.filter(c => !c.alias).size} commands with ${this.commands.filter(c => c.alias).size} aliases in \`${Date.now() - startTime}ms\``);

	}
};
