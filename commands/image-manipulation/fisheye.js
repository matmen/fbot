module.exports = {
	description: 'Adds a fisheye effect to an image',
	args: '(@user | Attachment | URL)',
	category: 'Fun',
	aliases: ['bulge', 'buldge'],
	cooldown: 5000,
	run: async function (message, args) {
		const images = await this.utils.getImagesFromMessage(message, args);

		if (images.length === 0) return this.commandHandler.invalidArguments(message);

		let image = await this.utils.fetchImage(images[0]);
		if (image instanceof Error) return this.utils.handleCommandError(image, message);

		image = await image.fisheye();
		image = await this.utils.getBufferFromJimp(image);

		message.channel.send({
			files: [{
				attachment: image,
				name: 'fisheye.png'
			}]
		});
	}
};
