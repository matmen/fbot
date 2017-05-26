module.exports = {
	description: 'delet yourself',
	category: 'Fun',
	aliases: ['delete'],
	args: '[@user]',
	cooldown: 1000,
	run: async function(message, args) {

		if(args.length === 0) {

			message.channel.send('delet yourself');

		} else if(args.length === 1 && args[0].match(/^(<@!?)?\d+>?$/)) {

			let id = args[0].replace(/[^\d]/g, '');
			if(id === '254696880120791040' || id === '277411860125581312') id = message.author.id;

			message.channel.send(`delet yourself, <@${id}>`);

		} else this.commandHandler.invalidArguments(message);

	}
};
