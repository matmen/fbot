module.exports = {
	description: 'Leave voice channel and remove queue',
	category: 'Fun',
	args: 'NONE',
	cooldown: 1000,
	run: async function(message) {
		const channel = message.guild.members.get(this.client.user.id).voiceChannel;
		if(!channel) return message.channel.send(':x: I am in no voice channel!');

		const queuedSongs = this.songQueues.has(message.guild.id) ? this.songQueues.get(message.guild.id).length : 0;
		this.songQueues.delete(message.guild.id);

		if(this.voiceStreams.has(message.guild.id)) {
			this.voiceStreams.get(message.guild.id).end();
			this.voiceStreams.delete(message.guild.id);
		}

		channel.leave();
		message.channel.send(`:white_check_mark: Left voice channel, removed ${queuedSongs} songs from the queue`);
	}
};
