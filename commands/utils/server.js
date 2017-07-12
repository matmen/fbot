module.exports = {
	description: 'Replies with the server\'s stats',
	category: 'Utils',
	args: '[server ID]',
	cooldown: 5000,
	run: async function (message, args) {
		let serverID = message.guild.id;

		if (args.length === 1 && args[0].match(/^\d+$/)) serverID = args[0].replace(/[^\d]/g, '');

		const stats = await this.utils.queryDB('SELECT (SELECT count(*) FROM messages WHERE serverid = $1) messages, (SELECT count(*) FROM commands WHERE serverid = $1) commands', [serverID]);
		const topCommandStats = await this.utils.queryDB('SELECT command,count(*) FROM commands WHERE serverid = $1 GROUP BY 1 ORDER BY count(*) DESC LIMIT 1', [serverID]);
		const topUserStats = await this.utils.queryDB('SELECT userid,count(*) FROM messages WHERE serverid = $1 GROUP BY 1 ORDER BY count(*) DESC LIMIT 1', [serverID]);

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

		let body = `Server owned by **${this.client.guilds.has(serverID) ? this.client.guilds.get(serverID).owner.user.tag : 'Unknown#0000'}**\n`;
		body += `Members: **${this.client.guilds.has(serverID) ? this.client.guilds.get(serverID).memberCount : 'Unknown'}**\n\n`;
		body += `Most messages from: ${this.client.users.has(topUser.id) ? this.client.users.get(topUser.id).tag : 'Unknown#0000'} (${topUser.messages || 0} messages)\n`;
		body += `Most used command: **${topCommand.command ? (this.botCfg.prefix + topCommand.command) : 'No commands used'}** (${topCommand.uses || 0} uses)\n\n`;
		body += `Commands used: **${commands}** in total\n`;
		body += `Messages sent: **${messages}** in total\n`;

		const embed = new this.api.RichEmbed();

		embed.setTitle(`User stats for ${this.client.guilds.has(serverID) ? this.client.guilds.get(serverID).name : 'Unknown Server'}`);
		embed.setThumbnail(this.client.guilds.has(serverID) && this.client.guilds.get(serverID).iconURL());
		embed.setDescription(body);
		embed.setFooter('fbot.menchez.me');
		embed.setColor(0x3366ff);

		message.channel.send({
			embed: embed
		});
	}
};
