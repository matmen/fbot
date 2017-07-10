module.exports = function() {

	this.client.on('message', async(message) => {

		if(message.channel.type === 'dm' || message.author.id === this.client.user.id || message.author.bot) return;

		const disabled = await this.utils.queryDB('SELECT value FROM settings WHERE server = $1 AND setting = $2 AND value = \'true\'', [message.guild.id, 'disableAutoreact']);
		if(disabled.rowCount > 0) return;

		const isBlacklisted = await this.utils.queryDB('SELECT * FROM blacklists WHERE (type = \'server\' AND id = $1) OR (type = \'channel\' AND id = $2) OR (type = \'user\' AND id = $3)', [message.guild.id, message.channel.id, message.author.id]);
		if(isBlacklisted.rowCount > 0) return;

		let text = message.content;

		if(text.match(/^ok$/i)) await message.react('🆗');

		if(text.match(/y\/n(\?)?$/i)) {
			await message.react('🔼');
			await message.react('🔽');
		}

		if(text.match(/🤔/gi)) await message.react('🤔');

		if(text.match(/(^| )lit( |$)/i)) await message.react('🔥');

		if(text.match(/is this the police/i)) await message.react('🚔');

		if(text.match(/press f/i)) await message.react('🇫');

		if(text.match(/snek/i)) await message.react('🐍');

		if(text.match(/murica/i)) await message.react('🇺🇸');

		if(text.match(/heil/i)) await message.react('🇩🇪');

		if(text.match(/^add fbot to your( discord)? server at fbot\.menchez\.me$/i)) message.channel.send(message.content);

	});

};
