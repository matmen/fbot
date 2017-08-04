module.exports = {
	description: 'Press F to pay respects',
	args: '(@user | Attachment | URL)',
	category: 'Fun',
	aliases: ['respects'],
	cooldown: 5000,
	run: async function (message, args) {
		const images = await this.utils.getImagesFromMessage(message, args);

		if (images.length === 0) return this.commandHandler.invalidArguments(message);

		const image = await this.utils.fetchFromAPI('respects', {
			images
		});

		message.channel.send({
			files: [{
				attachment: image,
				name: 'respects.png'
			}]
		});
	}
};
