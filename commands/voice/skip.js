module.exports = {
	description: 'Starts a vote to skip the current song',
	category: 'Voice',
	cooldown: 10000,
	run: async function (message, args) {
		if (!message.guild.me.voiceChannel || !this.voiceStreams.has(message.guild.id) || !this.playingSongs.has(message.guild.id)) return message.channel.send(':x: The bot isn\'t playing anything!');
		const currentSong = this.playingSongs.get(message.guild.id);

		if (currentSong.video.duration - (Date.now() - currentSong.startedAt) < 15000) return message.channel.send(':x: The song is ending in < 15s (Vote would take too long)');

		if (message.member.hasPermission('MANAGE_GUILD') && args[0] !== 'vote') {
			message.channel.send(':fast_forward: Sudo-Skipping current song');
			return this.voiceStreams.get(message.guild.id).end('skip');
		} else if (!message.member.voiceChannel || message.member.voiceChannel.id !== message.guild.me.voiceChannel.id) return message.channel.send(':x: You cant start a vote when you\'re not in the voice channel!');


		let skipVote = await message.channel.send('Voting to skip song: react with ✅ to skip, react with ❎ to vote against skipping. This vote will end in 10 seconds');
		await skipVote.react('✅');
		await skipVote.react('❎');

		const reactions = await skipVote.awaitReactions((reaction, user) => {
			if (!message.guild.member(user).voiceChannel) return false;
			if (!message.guild.me.voiceChannel) return false;
			return message.guild.member(user).voiceChannel.id === message.guild.me.voiceChannel.id;
		}, {
			time: 10000
		});

		skipVote.delete({
			timeout: 10000
		});

		const forVotes = reactions.has('✅') ? reactions.get('✅').users.size : 0;
		const againstVotes = reactions.get('❎') ? reactions.get('❎').users.size : 0;

		if (forVotes < againstVotes) return skipVote.edit(':x: Not enough votes to skip song');

		skipVote.edit(':fast_forward: Skipping current song');
		this.voiceStreams.get(message.guild.id).end('skip');
	}
};
