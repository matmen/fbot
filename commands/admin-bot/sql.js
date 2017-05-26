module.exports = {
	description: 'Executes SQL queries serverside',
	category: 'Botadmin',
	args: '(query)',
	cooldown: 1000,
	adminOnly: true,
	run: async function(message, args, argsString) {

		if(!argsString) return this.commandHandler.invalidArguments(message);

		const res = await this.utils.queryDB(argsString);

		message.channel.send(JSON.stringify(res.rows, null, 4), {
			code: 'json'
		});

	}
};
