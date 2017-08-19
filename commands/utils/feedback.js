module.exports = {
	description: 'Sends feedback to the bot delevoper',
	category: 'Utils',
	args: '(text..)',
	aliases: ['complain', 'fix'],
	cooldown: 20000,
	run: async function (message, args, argsString) {
		if (!argsString) return this.commandHandler.invalidArguments(message);

		let embed = new this.api.MessageEmbed();

		embed.setTitle('Feedback');
		embed.setDescription(argsString);

		embed.addField('User', message.author.tag, true);
		embed.addField('User ID', message.author.id, true);

		embed.addField('Channel', '#' + message.guild ? message.channel.name : 'DM', true);
		embed.addField('Channel ID', message.guild ? message.channel.id : 'N/A', true);

		embed.addField('Server', message.guild ? message.guild.name : 'DM', true);
		embed.addField('Server ID', message.guild ? message.guild.id : 'N/A', true);

		embed.setFooter('Feedback #' + message.id);
		embed.setColor(0x3366ff);

		embed.setThumbnail(message.author.displayAvatarURL({
			format: 'png',
			size: 2048
		}));

		await this.client.api.channels[this.botCfg.logChannel].messages.post({
			data: {
				embed: embed
			}
		});

		message.channel.send('Feedback sent!');
	}
};
