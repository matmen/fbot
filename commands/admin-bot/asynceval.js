module.exports = {
	description: 'Evaluates code asynchonously on the current shard',
	category: 'Botadmin',
	cooldown: 1000,
	args: '(code..)',
	aliases: ['aeval'],
	adminOnly: true,
	run: async function (message, args, argsString) {
		if (!argsString) return this.commandHandler.invalidArguments(message);

		let result = await eval(`(async()=>{${argsString}})()`);
		result = this.util.inspect(result);

		message.channel.send(result, {
			code: 'js'
		});
	}
};
