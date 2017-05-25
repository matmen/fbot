module.exports = {
	description: 'Taking out the trash',
	args: '(@user | Attachment | URL)',
	aliases: ['walk', 'trash'],
	category: 'Fun',
	cooldown: 1000,
	run: async function(message, args) {

		const images = this.utils.getImagesFromMessage(message, args);

		if(images.length === 0) return this.commandHandler.invalidArguments(message);

		let image = await this.utils.fetchImage(images[0]);
		let overlay = await this.jimp.read('./assets/america.png');
		overlay = await overlay.resize(image.bitmap.width, image.bitmap.height, this.jimp.RESIZE_BILINEAR);
		image = await image.composite(overlay, 0, 0);
		image = await this.utils.getBufferFromJimp(image);

		message.channel.send({
			files: [{
				attachment: image,
				name: 'america.png'
			}]
		});

	}
};
