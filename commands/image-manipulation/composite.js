module.exports = {
	description: 'Overlays all images over each other',
	args: '(@user | Attachment | URL)+',
	category: 'Fun',
	aliases: ['merge'],
	cooldown: 5000,
	run: async function (message, args) {
		const images = this.utils.getImagesFromMessage(message, args);

		if (images.length < 2) return this.commandHandler.invalidArguments(message);

		let result;
		for (let index = 0; index < images.length; index++) {
			let image = await this.utils.fetchImage(images[index]);

			if (!result) result = new this.jimp(image.bitmap.width, image.bitmap.height, 0xFFFFFFFF);

			image = await image.opacity(1 / (index + 2));
			result.composite(await image.resize(result.bitmap.width, result.bitmap.height), 0, 0);
		}

		result = await this.utils.getBufferFromJimp(result);

		message.channel.send({
			files: [{
				attachment: result,
				name: 'composite.png'
			}]
		});
	}
};
