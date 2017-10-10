module.exports = function () {

	this.client.on('message', async(message) => {
		if (message.author.bot || !message.guild) return;

		this.utils.queryDB('INSERT INTO messages VALUES ($1, $2, $3, $4)', [message.id, message.author.id, message.channel.id, message.guild.id]);
		this.utils.fetchFromAPI('markov/train', {
			args: {
				text: message.content
			}
		});

		const xpResult = await this.utils.queryDB('SELECT count(*) FROM xp WHERE userid = $1 AND serverid = $2 AND time > $3', [message.author.id, message.guild.id, Date.now() - 5 * 60 * 1000]);
		if (xpResult.rows[0].count > 0) return;

		const addedXp = Math.round(Math.random() * 10) + 15;

		await this.utils.queryDB('INSERT INTO xp VALUES ($1, $2, $3, $4)', [message.author.id, message.guild.id, addedXp, Date.now()]);
		const levelupSetting = await this.utils.queryDB('SELECT value FROM settings WHERE server = $1 AND setting = $2', [message.guild.id, 'levelUpMessage']);
		if (levelupSetting.rowCount < 1) return;

		const query = await this.utils.queryDB('SELECT sum(xp) FROM xp WHERE userid = $1 AND serverid = $2', [message.author.id, message.guild.id]);

		const newXp = query.rows[0].sum || 0;
		const oldXp = newXp - addedXp;

		const oldLevel = Math.floor((oldXp ** (1 / 1.2)) / 64);
		const newLevel = Math.floor((newXp ** (1 / 1.2)) / 64);

		const levelUpMessage = levelupSetting.rows[0].value
			.replace(/{MENTION}/gi, message.author.toString())
			.replace(/{USERNAME}/gi, message.author.username)
			.replace(/{DISCRIM}/gi, message.author.discriminator)
			.replace(/{TAG}/gi, message.author.tag)
			.replace(/{SERVER}/gi, message.guild.name)
			.replace(/{XP}/gi, newXp)
			.replace(/{LEVEL}/gi, newLevel);

		if (newLevel > oldLevel) message.channel.send(levelUpMessage);
	});

};
