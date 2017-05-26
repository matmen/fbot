module.exports = {
	description: 'Adds the brazzers logo to the given argument',
	args: '(@user | Attachment | URL)',
	category: 'Fun',
	cooldown: 5000,
	run: async function(message, args) {

		const images = this.utils.getImagesFromMessage(message, args);

		if(images.length === 0) return this.commandHandler.invalidArguments(message);

		let image = await this.utils.fetchImage(images[0]);
		let overlay = await this.jimp.read('./assets/brazzers.png');
		overlay = await overlay.resize(image.bitmap.width / 3, this.jimp.AUTO);
		image = await image.composite(overlay, (image.bitmap.width - overlay.bitmap.width), (image.bitmap.height - overlay.bitmap.height));
		image = await this.utils.getBufferFromJimp(image);

		message.channel.send({
			files: [{
				attachment: image,
				name: 'brazzers.png'
			}]
		});

	}
};
