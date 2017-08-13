module.exports = {
	description: 'Replies with the user\'s avatar',
	category: 'Utils',
	args: '[@user]',
	cooldown: 1000,
	run: async function (message, args, argsString) {
		let user = message.author;

		if (argsString) {
			const match = message.guild.members.filter(member => {
				if (member.user.tag.toLowerCase().includes(argsString.toLowerCase())) return true;
				if (member.nickname && member.nickname.toLowerCase().includes(argsString.toLowerCase())) return true;
				if (member.user.id === argsString.replace(/[^\d]/g, '')) return true;
				return false;
			}).sort((m1, m2) => {
				const m1Time = m1.lastMessage && m1.lastMessage.createdTimestamp || 0;
				const m2Time = m2.lastMessage && m2.lastMessage.createdTimestamp || 0;

				return m2Time - m1Time;
			}).first();

			if (match) user = match.user;
		}

		message.channel.send(`\`${user.tag}\`${user.avatar ? `'s avatar is ${user.avatarURL({format: user.avatar.startsWith('a_') ? 'gif' : 'png', size: 2048})}` : ' does not have an avatar set'}`);
	}
};
