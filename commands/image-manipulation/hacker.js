module.exports = {
	description: 'Hacking in progress..',
	args: '(text..)',
	category: 'Fun',
	aliases: ['hack'],
	cooldown: 5000,
	run: async function (message, args, argsString) {
		if (!argsString) return this.commandHandler.invalidArguments(message);

		const image = await this.utils.fetchFromAPI('hacker', {
			args: {
				text: this.utils.filterMentions(argsString)
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
