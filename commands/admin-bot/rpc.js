module.exports = {
	description: 'Evaluates code on all shards',
	category: 'Botadmin',
	cooldown: 1000,
	args: '(code..)',
	adminOnly: true,
	run: async function(message, args, argsString) {

		if(!argsString) return this.commandHandler.invalidArguments(message);

		let result = await this.client.shard.broadcastEval(argsString);
		result = JSON.stringify(result, null, 4) || '[]';

		message.channel.send(result, {
			code: 'js'
		});

	}
};
