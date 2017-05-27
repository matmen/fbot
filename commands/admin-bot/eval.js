module.exports = {
	description: 'Evaluates code on the shard',
	category: 'Botadmin',
	cooldown: 1000,
	args: '(code..)',
	adminOnly: true,
	run: async function(message, args, argsString) {

		if(!argsString) return this.commandHandler.invalidArguments(message);

		try {

			let result = eval(argsString);

			result = JSON.stringify(result, null, 4);

			message.channel.send(result, {
				code: 'js'
			});

		} catch(err) {

			message.channel.send(err.toString(), {
				code: 'js'
			});

		}

	}
};
