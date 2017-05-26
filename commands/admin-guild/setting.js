const trueStrings = ['1', 'true', 'yes', 'y', 'on', '+'];

const stringToBoolean = (value) => {
	return trueStrings.includes(value.toLowerCase());
};

const mentionToString = (value) => {
	return value.replace(/[^\d]/g, '');
};

const modifyableSettings = {
	'joinMessage': String,
	'leaveMessage': String,
	'messageChannel': mentionToString,
	'optOutOfAI': stringToBoolean,
	'disableAutoreact': stringToBoolean
};


module.exports = {
	description: 'Sets a server specific setting',
	category: 'Serveradmin',
	args: '(setting) | (setting) (value) | (setting) clear',
	cooldown: 1000,
	run: async function(message, args) {
		if(args.length === 0) return this.commandHandler.invalidArguments(message);

		const setting = args.shift();

		if(!modifyableSettings[setting]) return message.channel.send(`The setting \`${setting}\` does not exist\nAvailable settings:\n\n\`${Object.keys(modifyableSettings).join('` - `')}\``);

		if(args.length === 0) {

			this.db.connect((err, cli, done) => {
				if(err) return this.utils.handleCommandError(err, message, done);

				cli.query('SELECT value FROM settings WHERE setting = $1 AND server = $2', [setting, message.guild.id], (err, res) => {
					if(err) return this.utils.handleCommandError(err, message, done);
					done();

					if(res.rowCount === 0) return message.channel.send(`Setting \`${setting}\` is not set!`);

					message.channel.send(`Setting \`${setting}\` is currently set to \`${res.rows[0].value}\``);
				});

			});

		} else {

			if(!message.member.hasPermission('ADMINISTRATOR') && !this.utils.isAdmin(message.author.id)) return message.channel.send('Only guild administrators can modify settings');

			if(args.length >= 1) {

				const value = modifyableSettings[setting](args.join(' '));

				if(['clear', 'delete'].includes(value)) {

					this.db.connect((err, cli, done) => {
						if(err) return this.utils.handleCommandError(err, message, done);

						cli.query('DELETE FROM settings WHERE server = $1 AND setting = $2', [message.guild.id, setting], (err) => {
							if(err) return this.utils.handleCommandError(err, message, done);
							done();

							message.channel.send(`Setting \`${setting}\` has been cleared`);
						});

					});

				} else {

					this.db.connect((err, cli, done) => {
						if(err) return this.utils.handleCommandError(err, message, done);

						cli.query('INSERT INTO settings VALUES ($1, $2, $3)', [message.guild.id, setting, value], (err) => {
							if(err) return this.utils.handleCommandError(err, message, done);
							done();

							message.channel.send(`Setting \`${setting}\` has been set to \`${value}\``);
						});

					});

				}

			} else this.commandHandler.invalidArguments(message);

		}
	}
};
