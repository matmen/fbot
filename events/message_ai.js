module.exports = function() {

	this.client.on('message', async(message) => {

		if(message.channel.type === 'dm' || message.author.id === this.client.user.id || message.author.bot || message.content.startsWith(this.botCfg.prefix)) return;

		const disabled = await this.utils.queryDB('SELECT value FROM settings WHERE server = $1 AND setting = $2 AND value = \'true\'', [message.guild.id, 'optOuOfAI']);
		if(disabled.rowCount > 0) return;

		const isBlacklisted = await this.utils.queryDB('SELECT * FROM blacklists WHERE (type = \'server\' AND id = $1) OR (type = \'channel\' AND id = $2) OR (type = \'user\' AND id = $3)', [message.guild.id, message.channel.id, message.author.id]);
		if(isBlacklisted.rowCount > 0) return;

		if(!this.aiFilter.check(message.content)) return;

		this.utils.queryDB('INSERT INTO ai VALUES ($1, $2)', [message.id, message.content]);

	});

};
