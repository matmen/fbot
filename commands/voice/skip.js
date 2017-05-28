module.exports = {
	description: 'Returns your video queue',
	category: 'Fun',
	args: 'NONE',
	cooldown: 10 * 1000,
	run: async function(message) {
		if(!this.voiceStreams.has(message.guild.id) || !message.guild.members.get(this.client.user.id).voiceChannel) return message.channel.send(':x: The bot isn\'t playing anything!');

		if(message.member.hasPermission('ADMINISTRATOR')) {
			message.channel.send('Sudo-Skipped song');
			return this.voiceStreams.get(message.guild.id).end();
		}

		let skipVote = await message.channel.send('Voting to skip song: react with ✅ to skip, react with ❎ to veto. This vote will end in 10 seconds');
		await skipVote.react('✅');
		await skipVote.react('❎');

		const reactions = await skipVote.awaitReactions((reaction, user) => {
			if(!message.guild.members.get(user.id).voiceChannel) return false;
			return message.guild.members.get(user.id).voiceChannel.id === message.guild.members.get(this.client.user.id).voiceChannel.id;
		}, {
			time: 10000
		});

		const forVotes = reactions.has('✅') ? reactions.get('✅').users.size : 0;
		const againstVotes = reactions.get('❎') ? reactions.get('❎').users.size : 0;

		if(forVotes <= againstVotes) {
			message.edit(':x: Not enough votes to skip song');
			return skipVote.clearReactions();
		}

		skipVote.edit(':fast_forward: Skipping current song');
		skipVote.clearReactions();
		this.voiceStreams.get(message.guild.id).end();
	}
};
