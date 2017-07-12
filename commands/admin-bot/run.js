module.exports = {
	description: 'Evaluates code on the current shard',
	category: 'Botadmin',
	cooldown: 1000,
	args: '(code..)',
	adminOnly: true,
	run: async function (message, args, argsString) {
		if (!argsString) return this.commandHandler.invalidArguments(message);

		this.childProcess.exec(argsString, (err, result) => {
			message.channel.send(err ? `Error: ${err}` : result, {
				code: true
			});
		});
	}
};
