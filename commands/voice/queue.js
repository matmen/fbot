module.exports = {
	description: 'Returns your video queue',
	category: 'Fun',
	args: 'NONE',
	cooldown: 1000,
	run: async function(message) {
		if(!this.songQueues.has(message.channel.id)) return message.channel.send(`The song queue is empty, add songs using ${this.botCfg.prefix}play`);

		const queue = this.songQueues.get(message.channel.id);

		if(!queue || queue.length === 0) return message.channel.send('There are no songs queued');

		let reply = 'Song queue:\n';

		let id = 0;
		for(const song of queue) {
			id++;
			reply += `**${id}**: \`${song.video.title}\` by \`${song.video.author}\` - Queued by \`${this.client.users.has(song.user) ? this.client.users.get(song.user).tag : 'Unknown#0000'}\`\n`;
		}

		message.channel.send(reply);
	}
};
