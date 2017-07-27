module.exports = function () {

	this.client.on('message', async(message) => {
		if (message.channel.type === 'dm' || message.author.id === this.client.user.id || message.author.bot) return;

		const disabled = await this.utils.queryDB('SELECT value FROM settings WHERE server = $1 AND setting = $2 AND value = \'true\'', [message.guild.id, 'disableAutoreact']);
		if (disabled.rowCount > 0) return;

		const isBlacklisted = await this.utils.queryDB('SELECT * FROM blacklists WHERE (type = \'server\' AND id = $1) OR (type = \'channel\' AND id = $2) OR (type = \'user\' AND id = $3)', [message.guild.id, message.channel.id, message.author.id]);
		if (isBlacklisted.rowCount > 0) return;

		let text = message.content.toLowerCase();

		if (text === 'ok') await message.react('🆗');

		if (/y\/n(\?)?$/.test(text)) {
			await message.react('🔼');
			await message.react('🔽');
		}

		if (text.includes('🤔')) await message.react('🤔');

		if (/\blit\b/i.test(text)) await message.react('🔥');

		if (text.includes('press f')) await message.react('🇫');

		if (text.includes('snek')) await message.react('🐍');

		if (text.includes('murica')) await message.react('🇺🇸');

		if (text.includes('heil')) await message.react('🇩🇪');

		if (/^add fbot to your( discord)? server at fbot\.menchez\.me$/.test(text)) message.channel.send(message.content);

		if (text.includes('machine broke')) message.channel.send('understandable, have a nice day');
	});

};
