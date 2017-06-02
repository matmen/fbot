module.exports = {
	description: 'Rplies with the user\'s stats',
	category: 'Utils',
	args: '[@user]',
	cooldown: 5000,
	run: async function(message, args) {

		let userID = message.author.id;

		if(args.length === 1 && args[0].match(/^(<@!?)?\d+>?$/)) userID = args[0].replace(/[^\d]/g, '');

		const stats = await this.utils.queryDB('SELECT (SELECT count(*) FROM messages WHERE userid = $1) messages, (SELECT count(*) FROM commands WHERE userid = $1) commands', [userID]);
		const topCommandStats = await this.utils.queryDB('SELECT command,count(*) FROM commands WHERE userid = $1 GROUP BY 1 ORDER BY count(*) DESC LIMIT 1', [userID]);
		const topSongStats = await this.utils.queryDB('SELECT id,count(*) FROM songs WHERE userid = $1 GROUP BY 1 ORDER BY count(*) DESC LIMIT 1', [userID]);

		const messages = stats.rows[0].messages;
		const commands = stats.rows[0].commands;

		const servers = this.client.guilds.filter(g => g.members.has(userID));
		const shownServers = servers.array().slice(-3);

		const topCommand = {
			command: topCommandStats.rows[0] && topCommandStats.rows[0].command,
			uses: topCommandStats.rows[0] && topCommandStats.rows[0].count
		};

		const topSong = {
			id: topSongStats.rows[0] && topSongStats.rows[0].id,
			timesPlayed: topSongStats.rows[0] && topSongStats.rows[0].count
		};

		let body = `Seen on ${servers.size} servers (Shard ${this.client.shard.id}): `;
		body += `\`${shownServers.map(s => s.name).join('`, `')} ${shownServers.length < servers.size ? `+ ${servers.size - shownServers.length} more` : ''}\`\n\n`;
		body += `Most used command: **${topCommand.command ? (this.botCfg.prefix + topCommand.command) : 'No commands used'}** (${topCommand.uses || 0} uses)\n`;
		body += `Most played song: ${topSong.id ? `[Click here](https://youtube.com/watch?v=${topSong.id}) (Played ${topSong.timesPlayed} times)` : 'No songs played'}\n\n`;
		body += `Commands used: **${commands}** in total\n`;
		body += `Messages sent: **${messages}** in total`;

		const embed = new this.api.RichEmbed();

		embed.setTitle(`User stats for ${this.client.users.has(userID) ? this.client.users.get(userID).tag : 'Unknown#0000'}`);
		embed.setThumbnail(this.client.users.has(userID) && this.client.users.get(userID).avatarURL());
		embed.setDescription(body);
		embed.setFooter('fbot.menchez.me');
		embed.setColor(0x3366ff);

		message.channel.send({
			embed: embed
		});

	}
};
