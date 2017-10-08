module.exports = {
	description: 'Shows a user\'s XP',
	category: 'XP',
	args: '[user]',
	cooldown: 1000,
	run: async function (message, args, argsString) {
		if (!message.guild) return message.channel.send('Sorry, but this command cannot be used via DM!');

		let user = message.author;

		if (argsString) {
			const match = this.utils.getMemberFromString(message, argsString);
			if (match) user = match.user;
		}

		const query = await this.utils.queryDB('SELECT sum(xp) FROM xp WHERE userid = $1 AND serverid = $2', [user.id, message.guild.id]);
		const xp = query.rows[0].sum || 0;

		const level = Math.floor((xp ** (1 / 1.2)) / 64);
		const xpRange = [level, level + 1].map(level => Math.ceil((level * 64) ** 1.2));

		const embed = new this.api.MessageEmbed();

		embed.setAuthor(user.tag, user.displayAvatarURL({
			format: 'png',
			size: 2048
		}));

		embed.addField('Level', level, true);
		embed.addField('XP to next Level', `${xp - xpRange[0]} / ${xpRange[1] - xpRange[0]} (${Math.floor((xp - xpRange[0]) / (xpRange[1] - xpRange[0]) * 100)}%)`, true);
		embed.addField('Total XP', xp, true);

		embed.setColor(0x33ff66);
		embed.setTimestamp();

		message.channel.send({
			embed
		});
	}
};
