module.exports = {
	description: 'delet yourself',
	category: 'Fun',
	aliases: ['delete'],
	args: '[@user]',
	cooldown: 1000,
	run: async function (message, args) {
		if (args.length === 0) {
			message.channel.send('delet yourself');
		} else if (args.length === 1 && /^(<@!?)?\d+>?$/.test(args[0])) {
			let id = args[0].replace(/[^\d]/g, '');
			if (id === this.client.user.id || this.utils.isAdmin(id)) id = message.author.id;

			message.channel.send(`delet yourself, <@${id}>`);
		} else this.commandHandler.invalidArguments(message);
	}
};
