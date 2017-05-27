module.exports = function() {

	this.client.on('guildDelete', (guild) => {
		const embed = new this.api.RichEmbed();

		const botCount = guild.members.filter((u) => u.user.bot).size;

		embed.setTitle('Removed from ' + guild.name);
		embed.addField('Users', guild.memberCount, true);
		embed.addField('Bots', botCount, true);
		embed.addField('Bots/Users Ratio', (Math.round(botCount / guild.memberCount * 1000) / 1000), true);
		embed.setThumbnail(guild.icon ? ('https://cdn.discordapp.com/icons/' + guild.id + '/' + guild.icon + '.png?size=64') : 'https://placeholdit.imgix.net/~text?txtsize=16&txt=NO%20ICON&w=64&h=64');
		embed.setFooter('Server ID: ' + guild.id);
		embed.setColor(0xff3333);

		this.client.api.channels(this.botCfg.logChannel).messages.post({
			data: {
				embed: embed
			}
		});
	});

};
