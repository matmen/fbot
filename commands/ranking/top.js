module.exports = {
	description: 'Lists the users with the most XP on the current server',
	category: 'XP',
	cooldown: 1000,
	run: async function (message) {
		if (!message.guild) return message.channel.send('Sorry, but this command cannot be used via DM!');

		const query = await this.utils.queryDB('SELECT userid, sum(xp) FROM xp WHERE serverid = $1 GROUP BY userid ORDER BY sum(xp) DESC LIMIT 5', [message.guild.id]);

		const embed = new this.api.MessageEmbed();
		embed.setAuthor(message.guild.name, message.guild.iconURL({
			type: 'png',
			size: 2048
		}));

		for (const row of query.rows) {
			const level = Math.floor((row.sum ** (1 / 1.2)) / 64);
			embed.addField(this.client.users.has(row.userid) ? this.client.users.get(row.userid).tag : 'Unknown User#0000', `Level ${level} (${row.sum} XP)`);
		}

		embed.setColor(0x33ff66);
		embed.setTimestamp();

		message.channel.send({
			embed
		});
	}
};
