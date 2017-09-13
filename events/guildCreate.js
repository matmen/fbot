module.exports = function () {

	this.client.on('guildCreate', (guild) => {
		const embed = new this.api.MessageEmbed();

		const botCount = guild.members.filter((u) => u.user.bot).size;
		const botFarm = botCount / guild.memberCount > 0.5 && guild.memberCount > 10;

		embed.setTitle('Added to ' + guild.name);
		if (botFarm) embed.setDescription('⚠ This server might be a bot farm (~' + Math.round(botCount / guild.memberCount * 100) + '% bots)');
		embed.addField('Users', guild.memberCount, true);
		embed.addField('Bots', botCount, true);
		embed.addField('Bots/Users Ratio', (Math.round(botCount / guild.memberCount * 1000) / 1000), true);
		embed.setThumbnail(guild.icon ? ('https://cdn.discordapp.com/icons/' + guild.id + '/' + guild.icon + '.png?size=64') : 'https://placeholdit.imgix.net/~text?txtsize=16&txt=NO%20ICON&w=64&h=64');
		embed.setFooter('Server ID: ' + guild.id);
		embed.setColor(botFarm ? 0xffff33 : 0x33ff33);

		this.client.api.channels[this.botCfg.logChannel].messages.post({
			data: {
				embed
			}
		});

		const channel = guild.channels.filter(c => c.type === 'text' && c.permissionsFor(guild.me).has('SEND_MESSAGES')).sort((a, b) => a.position - b.position).first();
		if (channel) channel.send(this.botCfg.messages.serverJoinMessage);
	});

};
