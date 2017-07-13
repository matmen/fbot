module.exports = {
	description: 'Adds the russian flag to the given argument',
	args: '(@user | Attachment | URL)',
	aliases: ['vodka', 'cyka'],
	category: 'Fun',
	cooldown: 5000,
	run: async function (message, args) {
		const images = await this.utils.getImagesFromMessage(message, args);

		if (images.length === 0) return this.commandHandler.invalidArguments(message);

		let image = await this.utils.fetchImage(images[0]);
		let overlay = await this.jimp.read('./assets/russia.png');
		overlay = await overlay.resize(image.bitmap.width, image.bitmap.height, this.jimp.RESIZE_BILINEAR);
		image = await image.composite(overlay, 0, 0);
		image = await this.utils.getBufferFromJimp(image);

		message.channel.send({
			files: [{
				attachment: image,
				name: 'russia.png'
			}]
		});
	}
};
