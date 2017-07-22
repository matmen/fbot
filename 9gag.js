module.exports = {
	description: 'Adds the 9gag overlay to an image.',
	args: '(@user | Attachment | URL)',
	category: 'Fun',
	cooldown: 5000,
	run: async function (message, args) {
		const images = await this.utils.getImagesFromMessage(message, args);

		if (images.length === 0) return this.commandHandler.invalidArguments(message);

		let image = await this.utils.fetchImage(images[0]);
		if (image instanceof Error) return this.utils.handleCommandError(image, message);

        let overlay = await jimp.read('./assets/9gag.png');
        image = await image.composite(overlay, image.bitmap.width-overlay.bitmap.width-5, image.bitmap.height/2 - overlay.bitmap.height/2);

		image = await this.utils.getBufferFromJimp(image);

		message.channel.send({
			files: [{
				attachment: image,
				name: '9gag.png'
			}]
		});
	}
};