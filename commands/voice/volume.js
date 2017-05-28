module.exports = {
	description: 'Sets the current playback volume',
	category: 'Voice',
	args: '(volume)',
	cooldown: 1000,
	run: async function(message, args) {
		if(args.length !== 1 || isNaN(args[0])) return this.commandHandler.invalidArguments(message);
		if(!this.voiceStreams.has(message.guild.id) || !message.guild.members.get(this.client.user.id).voiceChannel) return message.channel.send(':x: The bot isn\'t playing anything!');

		const volume = Math.max(0, Math.min(100, parseInt(args)));

		let emote = volume !== 0 ? volume >= 25 ? volume >= 75 ? ':loud_sound:' : ':sound:' : ':speaker:' : ':mute:';

		this.voiceStreams.get(message.guild.id).setVolume(volume / 100);
		message.channel.send(`${emote} Volume set to ${volume}%`);
	}
};
