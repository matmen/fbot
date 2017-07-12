module.exports = {
	description: 'Replies with the user\'s avatar',
	category: 'Utils',
	args: '[@user]',
	cooldown: 1000,
	run: async function (message, args) {
		let id = args[0];
		if (!id) id = message.author.id;

		if (!id.match(/^(<@!?)?\d+>?$/)) return this.commandHandler.invalidArguments(message);
		id = id.replace(/[^\d]/g, '');

		if (!this.client.users.has(id)) return message.channel.send('The requested user could not be found');
		const user = this.client.users.get(id);

		message.channel.send(`\`${user.tag}\`${user.avatar ? `'s avatar is ${user.avatarURL({format: user.avatar.startsWith('a_') ? 'gif' : 'png', size: 2048})}` : ' does not have an avatar set'}`);
	}
};
