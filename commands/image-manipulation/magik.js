module.exports = {
	description: 'Adds a liquid filter to the image',
	args: '(@user | Attachment | URL)',
	category: 'Fun',
	aliases: ['magic', 'magick', 'cas', 'liquid'],
	cooldown: 5000,
	run: async function (message, args) {
		const images = await this.utils.getImagesFromMessage(message, args);

		if (images.length === 0) return this.commandHandler.invalidArguments(message);

		const image = await this.utils.fetchFromAPI('magik', {
			images
		});

		message.channel.send({
			files: [{
				attachment: image,
				name: 'magik.png'
			}]
		});
	}
};
