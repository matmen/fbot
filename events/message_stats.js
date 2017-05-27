module.exports = function() {

	this.client.on('message', async(message) => {

		if(message.author.bot || message.channel.type === 'dm') return;

		const isBlacklisted = await this.utils.queryDB('SELECT * FROM blacklists WHERE (type = \'server\' AND id = $1) OR (type = \'channel\' AND id = $2) OR (type = \'user\' AND id = $3)', [message.guild.id, message.channel.id, message.author.id]);
		if(isBlacklisted.rowCount > 0) return;

		this.utils.queryDB('INSERT INTO messages VALUES ($1, $2, $3, $4)', [message.id, message.author.id, message.channel.id, message.guild.id]);

	});

};
