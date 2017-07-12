module.exports = {
	description: 'Evaluates code on the current shard',
	category: 'Botadmin',
	cooldown: 1000,
	args: '(code..)',
	adminOnly: true,
	run: async function (message, args, argsString) {
		if (!argsString) return this.commandHandler.invalidArguments(message);

		let result = eval(argsString);
		result = JSON.stringify(result, null, 4) || 'undefined';

		message.channel.send(result, {
			code: 'js'
		});
	}
};
