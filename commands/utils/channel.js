module.exports = {
	description: 'Replies with the channel\'s stats',
	category: 'Utils',
	args: '[#channel]',
	cooldown: 5000,
	run: async function (message, args) {
		let channelID = message.channel.id;

		if (args.length === 1 && args[0].match(/^(<#!?)?\d+>?$/)) channelID = args[0].replace(/[^\d]/g, '');

		const stats = await this.utils.queryDB('SELECT (SELECT count(*) FROM messages WHERE channelID = $1) messages, (SELECT count(*) FROM commands WHERE channelid = $1) commands', [channelID]);
		const topCommandStats = await this.utils.queryDB('SELECT command,count(*) FROM commands WHERE channelid = $1 GROUP BY 1 ORDER BY count(*) DESC LIMIT 1', [channelID]);
		const topUserStats = await this.utils.queryDB('SELECT userid,count(*) FROM messages WHERE channelid = $1 GROUP BY 1 ORDER BY count(*) DESC LIMIT 1', [channelID]);

		const messages = stats.rows[0].messages;
		const commands = stats.rows[0].commands;

		const topCommand = {
			command: topCommandStats.rows[0] && topCommandStats.rows[0].command,
			uses: topCommandStats.rows[0] && topCommandStats.rows[0].count
		};

		const topUser = {
			id: topUserStats.rows[0] && topUserStats.rows[0].userid,
			messages: topUserStats.rows[0] && topUserStats.rows[0].count
		};

		let body = `Most messages from: ${this.client.users.has(topUser.id) ? this.client.users.get(topUser.id).tag : 'Unknown#0000'} (${topUser.messages || 0} messages)\n`;
		body += `Most used command: **${topCommand.command ? (this.botCfg.prefix + topCommand.command) : 'No commands used'}** (${topCommand.uses || 0} uses)\n\n`;
		body += `Commands used: **${commands}** in total\n`;
		body += `Messages sent: **${messages}** in total\n`;

		const embed = new this.api.RichEmbed();

		embed.setTitle(`Channel stats for #${this.client.channels.has(channelID) ? this.client.channels.get(channelID).name : 'unknown'}`);
		embed.setThumbnail(this.client.channels.has(channelID) && this.client.channels.get(channelID).guild.iconURL());
		embed.setDescription(body);
		embed.setFooter('fbot.menchez.me');
		embed.setColor(0x3366ff);

		message.channel.send({
			embed: embed
		});
	}
};
