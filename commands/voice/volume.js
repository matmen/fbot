module.exports = {
	description: 'Sets or shows the current playback volume',
	category: 'Voice',
	args: '[volume]',
	cooldown: 1000,
	run: async function(message, args) {
		if(!this.voiceStreams.has(message.guild.id) || !message.guild.member(this.client.user).voiceChannel) return message.channel.send(':x: The bot isn\'t playing anything!');
		if(!message.member.voiceChannel || message.member.voiceChannel.id !== message.guild.member(this.client.user).voiceChannel.id) return message.channel.send(':x: You cant control the volume when you\'re not in the voice channel!');

		let volume;
		if(args.length === 1) {
			volume = Math.max(0, Math.min(100, parseInt(args[0])));
			this.voiceStreams.get(message.guild.id).setVolume(volume / 100);
		} else {
			volume = Math.round(this.voiceStreams.get(message.guild.id).volume * 100);
		}

		let emote = volume !== 0 ? volume >= 25 ? volume >= 75 ? ':loud_sound:' : ':sound:' : ':speaker:' : ':mute:';
		message.channel.send(`${emote} Volume ${args.length === 1 ? 'is now set to' : 'is currently set to'} ${volume}%`);
	}
};
