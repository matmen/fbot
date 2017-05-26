module.exports = {
	description: 'Sends feedback to the bot delevoper',
	category: 'Utils',
	args: '(text..)',
	cooldown: 1000,
	run: async function(message, args, argsString) {

		if(!argsString) return this.commandHandler.invalidArguments(message);

		let embed = new this.api.RichEmbed();

		embed.setTitle('Feedback');
		embed.setDescription(argsString);

		embed.addField('User', message.author.tag, true);
		embed.addField('User ID', message.author.id, true);

		embed.addField('Channel', '#' + message.channel.name, true);
		embed.addField('Channel ID', message.channel.id, true);

		embed.addField('Server', message.guild.name, true);
		embed.addField('Server ID', message.guild.id, true);

		embed.setFooter('Feedback #' + message.id);

		embed.setThumbnail(message.author.avatar ? ('https://cdn.discordapp.com/avatars/' + message.author.id + '/' + message.author.avatar + '.png?size=64') : 'https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.jpg?size=64');
		embed.setColor(0x3366ff);

		this.client.channels.get(this.botCfg.logChannel).send({
			embed: embed
		}).then(() => message.channel.send('Feedback sent!'));

	}
};
