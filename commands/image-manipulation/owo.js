module.exports = {
	description: 'OwO',
	args: '(@user | Attachment | URL)',
	category: 'Fun',
	cooldown: 5000,
	run: async function (message, args) {
		const images = await this.utils.getImagesFromMessage(message, args);

		if (images.length === 0) return this.commandHandler.invalidArguments(message);

		let raw = await this.jimp.read('./assets/owo.png');
		let image = await this.utils.fetchImage(images[0]);
		image = await image.resize(486, 281);
		image = await raw.composite(image, 96, 47);
		image = await this.utils.getBufferFromJimp(image);

		message.channel.send({
			files: [{
				attachment: image,
				name: 'owo.png'
			}]
		});
	}
};
