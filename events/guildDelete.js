module.exports = function() {

	this.client.on('guildDelete', (guild) => {
		const embed = new this.api.RichEmbed();

		embed.setTitle('Removed from ' + guild.name);
		embed.addField('Users', guild.memberCount, true);
		embed.setThumbnail(guild.icon ? ('https://cdn.discordapp.com/icons/' + guild.id + '/' + guild.icon + '.png?size=64') : 'https://placeholdit.imgix.net/~text?txtsize=16&txt=NO%20ICON&w=64&h=64');
		embed.setFooter('Server ID: ' + guild.id);
		embed.setColor(0xff3333);

		this.client.channels.get(this.botCfg.logChannel).send({
			embed: embed
		});
	});

};
