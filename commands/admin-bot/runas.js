module.exports = {
	description: 'Runs a command as a specific user',
	category: 'Botadmin',
	args: '(user) (command..)',
	adminOnly: true,
	cooldown: 1000,
	run: async function (message, args) {
		if (args.length < 2) return this.commandHandler.invalidArguments(message);

		const user = this.client.users.get(args.shift().replace(/[^\d]/g, ''));
		if (!user) return message.channel.send('Error: `Invalid User`');
		if (!message.guild.member(user)) return message.channel.send('Error: `User is not in guild`');

		this.client.emit('message', Object.assign(message, {
			author: user,
			member: message.guild.member(user),
			content: `<@${this.client.user.id}> ${args.join(' ')}`
		}));
	}
};
