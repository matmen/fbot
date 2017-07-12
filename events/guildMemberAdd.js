module.exports = function () {

	this.client.on('guildMemberAdd', async(member) => {
		let message = await this.utils.queryDB('SELECT value FROM settings WHERE server = $1 AND setting = $2', [member.guild.id, 'joinMessage']);
		if (message.rowCount === 0) return;
		message = message.rows[0].value;

		let channel = await this.utils.queryDB('SELECT value FROM settings WHERE server = $1 AND setting = $2', [member.guild.id, 'messageChannel']);

		if (channel.rowCount === 0) {
			channel = member.guild.defaultChannel;
		} else {
			channel = member.guild.channels.get(channel.rows[0].value);
		}

		if (!channel) return;

		message = message.replace(/{MENTION}/gi, member.toString())
			.replace(/{USERNAME}/gi, member.user.username)
			.replace(/{DISCRIM}/gi, member.user.discriminator)
			.replace(/{TAG}/gi, member.user.tag)
			.replace(/{SERVER}/gi, member.guild.name);

		channel.send(message);
	});

};
