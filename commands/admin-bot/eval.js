module.exports = {
	description: 'Evaluates code on the shard',
	category: 'Botadmin',
	cooldown: 1000,
	adminOnly: true,
	run: function(message, args, argsString) {

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
