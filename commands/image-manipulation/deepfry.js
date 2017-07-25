module.exports = {
	description: 'Deepfries the image',
	args: '(@user | Attachment | URL) [amount]',
	category: 'Fun',
	cooldown: 5000,
	run: async function (message, args) {
		const images = await this.utils.getImagesFromMessage(message, args);
		if (images.length === 0) return this.commandHandler.invalidArguments(message);

		let image = await this.utils.fetchImage(images[0]);
		if (image instanceof Error) return this.utils.handleCommandError(image, message);

		let amount = this.utils.isImageArg(message, args[0]) ? args[1] : args[0];
		amount = Math.max(1, Math.min(100, parseInt(amount) || 10));

		image = await image.brightness(.2);
		image = await image.contrast(amount / 100);

		image = await image.convolution([
			[-amount, -amount, -amount],
			[-amount, amount * 8 + 1, -amount],
			[-amount, -amount, -amount]
		]);

		image = await image.color([{
			apply: 'saturate',
			params: [amount * 5]
		}]);

		image = await image.quality(1);

		image = await this.utils.getBufferFromJimp(image, 'image/jpeg');

		message.channel.send(`\`Amount: ${amount}\``, {
			files: [{
				attachment: image,
				name: 'deepfry.jpg'
			}]
		});
	}
};
