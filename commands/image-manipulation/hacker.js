const variations = ['1', '2'];

module.exports = {
	description: 'Hacking in progress..',
	args: '[variation] (text..)',
	category: 'Fun',
	aliases: ['hack'],
	cooldown: 5000,
	run: async function (message, args, argsString) {
		if (!argsString) return this.commandHandler.invalidArguments(message);

		const text = variations.includes(args[0]) ? args.slice(1, args.length).join(' ') : argsString;
		const variation = variations.includes(args[0]) ? args[0] : '1';

		const image = await this.utils.fetchFromAPI('hacker', {
			args: {
				text: this.utils.filterMentions(text),
				variation
			}
		});

		message.channel.send({
			files: [{
				attachment: image,
				name: 'hacked.png'
			}]
		});
	}
};
