const types = ['user', 'channel', 'server'];

module.exports = {
	description: 'Blacklists a user, channel or guild from using commands',
	category: 'Botadmin',
	args: '(type) (id)',
	cooldown: 1000,
	adminOnly: true,
	run: function(message, args) {
		if(args.length !== 2) return this.commandHandler.invalidArguments(message);

		const type = args[0].toLowerCase();
		if(!types.includes(type)) return this.commandHandler.invalidArguments(message);

		const id = args[1].replace(/[^\d]/g, '');

		this.db.connect((err, cli, done) => {
			if(err) return this.utils.handleCommandError(err, message, done);

			cli.query('SELECT FROM blacklists WHERE type = $1 AND id = $2', [type, id], (err, res) => {
				if(err) return this.utils.handleCommandError(err, message, done);

				if(res.rowCount > 0) {

					cli.query('DELETE FROM blacklists WHERE type = $1 AND id = $2', [type, id], (err) => {
						if(err) return this.utils.handleCommandError(err, message, done);
						done();

						message.channel.send(`Successfully unblacklisted ${type} \`${id}\``);
					});

				} else {

					cli.query('INSERT INTO blacklists VALUES ($1, $2)', [type, id], (err) => {
						if(err) return this.utils.handleCommandError(err, message, done);
						done();

						message.channel.send(`Successfully blacklisted ${type} \`${id}\``);
					});

				}

			});

		});

	}
};
