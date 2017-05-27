module.exports = {
	interval: 30 * 60 * 1000,
	run: async function() {
		let guilds = await this.shardManager.fetchClientValues('guilds.size');
		let channels = await this.shardManager.fetchClientValues('channels.size'); // eslint-disable-line no-unused-vars
		let users = await this.shardManager.fetchClientValues('users.size'); // eslint-disable-line no-unused-vars
		let messages = await this.db.query('SELECT COUNT(*) FROM messages'); // eslint-disable-line no-unused-vars
		let commands = await this.db.query('SELECT COUNT(*) FROM COMMANDS'); // eslint-disable-line no-unused-vars
		let aiMessages = await this.db.query('SELECT COUNT(*) FROM ai'); // eslint-disable-line no-unused-vars
		let dbSize = await this.db.query('SELECT pg_database_size(\'fbot\') as size');
		guilds = guilds.reduce((all, val) => all + val, 0);
		channels = channels.reduce((all, val) => all + val, 0);
		users = users.reduce((all, val) => all + val, 0);
		messages = messages.rows[0].count;
		aiMessages = aiMessages.rows[0].count;
		commands = commands.rows[0].count;
		dbSize = dbSize.rows[0].size;

		this.db.query('INSERT INTO STATS VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [guilds, channels, users, messages, commands, aiMessages, dbSize, Date.now()]);
	}
};
