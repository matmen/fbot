module.exports = {
	description: 'For really big mistakes',
	args: '(@user | Attachment | URL)',
	category: 'Fun',
	cooldown: 5000,
	run: async function(message, args) {

		const images = this.utils.getImagesFromMessage(message, args);

		if(images.length === 0) return this.commandHandler.invalidArguments(message);

		let raw = await this.jimp.read('./assets/mistake.png');
		let image = await this.utils.fetchImage(images[0]);
		raw = await raw.resize(image.bitmap.width, image.bitmap.height);
		image = await image.composite(raw, 0, 0);
		image = await this.utils.getBufferFromJimp(image);

		message.channel.send({
			files: [{
				attachment: image,
				name: 'mistake.png'
			}]
		});

	}
};
