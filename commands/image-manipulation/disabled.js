module.exports = {
	description: 'Not all disablilities look like this',
	args: '(@user | Attachment | URL)',
	category: 'Fun',
	cooldown: 5000,
	run: async function(message, args) {

		const images = this.utils.getImagesFromMessage(message, args);

		if(images.length === 0) return this.commandHandler.invalidArguments(message);

		let raw = await this.jimp.read('./assets/disabled.png');
		let image = await this.utils.fetchImage(images[0]);
		image = await image.resize(157, 157);
		image = await raw.composite(image, 390, 252);
		image = await this.utils.getBufferFromJimp(image);

		message.channel.send({
			files: [{
				attachment: image,
				name: 'disabled.png'
			}]
		});

	}
};
