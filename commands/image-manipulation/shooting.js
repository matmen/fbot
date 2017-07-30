module.exports = {
	description: 'Top causes of mass shootings',
	args: '(text..)',
	category: 'Fun',
	cooldown: 5000,
	run: async function (message, args, argsString) {
		if (!argsString) return this.commandHandler.invalidArguments(message);

		const image = await this.utils.fetchFromAPI('shooting', {
			args: {
				text: this.utils.filterMentions(argsString)
			}
		});

		message.channel.send({
			files: [{
				attachment: image,
				name: 'shooting.png'
			}]
		});
	}
};
