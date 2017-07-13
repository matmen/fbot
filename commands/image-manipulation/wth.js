module.exports = {
	description: 'Worse than hitler',
	args: '(@user | Attachment | URL)',
	category: 'Fun',
	cooldown: 5000,
	run: async function (message, args) {
		const images = await this.utils.getImagesFromMessage(message, args);

		if (images.length === 0) return this.commandHandler.invalidArguments(message);

		let raw = await this.jimp.read('./assets/worsethanhitler.png');
		let image = await this.utils.fetchImage(images[0]);
		image = await image.resize(141, 161);
		image = await raw.composite(image, 46, 33);
		image = await this.utils.getBufferFromJimp(image);

		message.channel.send({
			files: [{
				attachment: image,
				name: 'worse than hitler.png'
			}]
		});
	}
};
