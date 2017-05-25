module.exports = {
	description: 'Adds the gay pride to the given argument',
	args: '(@user | Attachment | URL)',
	category: 'Fun',
	cooldown: 1000,
	run: async function(message, args) {

		const images = this.utils.getImagesFromMessage(message, args);

		if(images.length === 0) return this.commandHandler.invalidArguments(message);

		let image = await this.utils.fetchImage(images[0]);
		let gayPride = await this.jimp.read('./assets/gay.png');
		gayPride = await gayPride.resize(image.bitmap.width, image.bitmap.height, this.jimp.RESIZE_BILINEAR);
		image = await image.composite(gayPride, 0, 0);
		image = await this.utils.getBufferFromJimp(image);

		message.channel.send({
			files: [{
				attachment: image,
				name: 'gay.png'
			}]
		});

	}
};
