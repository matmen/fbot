module.exports = {
	description: 'Creates a wheel of fortune board with the given text',
	args: '(clue) (line1) [line2] [line3] [line4]',
	category: 'Fun',
	aliases: ['wheel'],
	cooldown: 5000,
	run: async function (message, args) {
		if (args.length < 2 || args.length > 5) return this.commandHandler.invalidArguments(message);

		const image = await this.utils.fetchFromAPI('wof', {
			args: {
				args
			}
		});

		message.channel.send({
			files: [{
				attachment: image,
				name: 'wof.png'
			}]
		});
	}
};
