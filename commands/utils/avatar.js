module.exports = {
	description: 'Replies with the user\'s avatar',
	category: 'Utils',
	args: '[@user]',
	cooldown: 1000,
	run: async function (message, args, argsString) {
		let user = message.author;

		if (argsString) {
			if (!message.guild) return message.channel.send('Sorry, but this command cannot be used with arguments via DM!');

			const match = this.utils.getMemberFromString(message, argsString);
			if (match) user = match.user;
		}

		message.channel.send(`\`${user.tag}\`${user.avatar ? `'s avatar is ${user.avatarURL({format: user.avatar.startsWith('a_') ? 'gif' : 'png', size: 2048})}` : ' does not have an avatar set'}`);
	}
};
