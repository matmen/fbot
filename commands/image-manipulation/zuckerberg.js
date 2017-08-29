module.exports = {
	description: 'what a nice photo',
	args: '(@user | Attachment | URL)',
	category: 'Fun',
	aliases: ['zuck', 'zucker'],
	cooldown: 5000,
	run: async function (message, args) {
		const images = await this.utils.getImagesFromMessage(message, args);

		if (images.length === 0) return this.commandHandler.invalidArguments(message);

		const image = await this.utils.fetchFromAPI('zuckerberg', {
			images
		});

		message.channel.send({
			files: [{
				attachment: image,
				name: 'zuckerberg.png'
			}]
		});
	}
};
