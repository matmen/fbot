module.exports = {
	description: 'Leaves the current voice channel and clears the song queue',
	category: 'Voice',
	cooldown: 1000,
	run: async function(message) {

		if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(`:x: Only guild administrators can force the bot to leave. Either wait until all songs have finished playing, or use \`${this.botCfg.prefix}skip\` to skip them`);

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
