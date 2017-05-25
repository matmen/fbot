module.exports = {
	description: 'Executes SQL queries serverside',
	category: 'Botadmin',
	args: '(query)',
	cooldown: 1000,
	adminOnly: true,
	run: function(message, args, argsString) {

		if(!argsString) return this.commandHandler.invalidArguments(message);

		this.db.connect((err, cli, done) => {
			if(err) return this.utils.handleCommandError(err, message, done);

			cli.query(argsString, (err, res) => {
				if(err) return this.utils.handleCommandError(err, message, done);

				message.channel.send(JSON.stringify(res.rows, null, 4), {
					code: 'json'
				});

			});
		});

	}
};
