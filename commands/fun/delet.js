module.exports = {
	description: 'delet yourself',
	category: 'Fun',
	aliases: ['delete'],
	args: '[user]',
	cooldown: 1000,
	run: async function (message, args, argsString) {
		if (!argsString) {
			message.channel.send('delet yourself');
		} else {
			let match = this.utils.getMemberFromString(message, argsString);
			if (!match) return this.commandHandler.invalidArguments(message);
			if (match.user.id === this.client.user.id || this.utils.isAdmin(match.user.id)) match = message.member;

			message.channel.send(`delet yourself, ${match}`);
		}
	}
};
