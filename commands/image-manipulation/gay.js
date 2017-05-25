module.exports = {
	description: 'Adds the gay pride to the given argument',
	category: 'Fun',
	cooldown: 1000,
	run: async function(message, args) {

		let image = await this.utils.fetchImage(this.utils.getImagesFromMessage(message, args)[0]);
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
