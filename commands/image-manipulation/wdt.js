module.exports = {
	description: 'who did this',
	args: '(@user | Attachment | URL)',
	aliases: ['whodidthis'],
	category: 'Fun',
	cooldown: 5000,
	run: async function (message, args) {
		const images = await this.utils.getImagesFromMessage(message, args);

		if (images.length === 0) return this.commandHandler.invalidArguments(message);

		let image = await this.utils.fetchImage(images[0]);
		if (image instanceof Error) return this.utils.handleCommandError(image, message);

		let raw = await this.jimp.read('./assets/wdt.png');
		image = await image.contain(700, 375);
		image = await raw.composite(image, raw.bitmap.width / 2 - image.bitmap.width / 2, raw.bitmap.height / 2 - image.bitmap.height / 2);
		image = await this.utils.getBufferFromJimp(image);

		message.channel.send({
			files: [{
				attachment: image,
				name: 'wdt.png'
			}]
		});
	}
};
