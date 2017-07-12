const youtubeHdConfig = {
	language: 'youtube',
	round: true,
	spacer: '',
	delimiter: ' '
};

module.exports = {
	description: 'Replies with the current queue',
	category: 'Voice',
	cooldown: 1000,
	run: async function (message) {
		const queue = this.songQueues.get(message.guild.id);

		if (!queue || queue.length === 0) return message.channel.send(`The song queue is empty, add songs using \`${this.botCfg.prefix}play\``);

		let reply = 'Song queue:\n';

		let id = 0;
		for (const song of queue) {
			id++;
			reply += `**${id}**: \`${song.video.title}\` by \`${song.video.author}\` \`[${this.hd(song.video.duration, youtubeHdConfig)}]\` - Queued by \`${this.client.users.has(song.user) ? this.client.users.get(song.user).tag : 'Unknown#0000'}\`\n`;
		}

		message.channel.send(reply);
	}
};
