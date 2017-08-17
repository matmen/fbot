module.exports = {
	interval: 30 * 60 * 1000,
	run: async function () {
		let guilds = await this.shardManager.fetchClientValues('guilds.size');
		let channels = await this.shardManager.fetchClientValues('channels.size');
		let users = await this.shardManager.fetchClientValues('users.size');
		let messages = await this.db.query('SELECT COUNT(*) FROM messages');
		let commands = await this.db.query('SELECT COUNT(*) FROM COMMANDS');
		let dbSize = await this.db.query('SELECT pg_database_size(\'fbot\') as size');
		guilds = guilds.reduce((all, val) => all + val, 0);
		channels = channels.reduce((all, val) => all + val, 0);
		users = users.reduce((all, val) => all + val, 0);
		messages = messages.rows[0].count;
		commands = commands.rows[0].count;
		dbSize = dbSize.rows[0].size;

		this.db.query('INSERT INTO STATS VALUES ($1, $2, $3, $4, $5, $6, $7)', [guilds, channels, users, messages, commands, dbSize, Date.now()]);
	}
};
