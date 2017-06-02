module.exports = {
	description: 'Evaluates code on the current shard',
	category: 'Botadmin',
	cooldown: 1000,
	args: '(code..)',
	adminOnly: true,
	run: async function(message, args, argsString) {
		if(!argsString) return this.commandHandler.invalidArguments(message);

		const result = this.childProcess.execSync(argsString);
		message.channel.send(result, {
			code: 'js'
		});

	}
};
