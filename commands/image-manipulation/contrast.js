module.exports = {
	description: 'Adjusts the image\'s contrast',
	args: '(@user | Attachment | URL) [amount]',
	category: 'Fun',
	cooldown: 5000,
	run: async function (message, args) {
		const images = await this.utils.getImagesFromMessage(message, args);
		if (images.length === 0) return this.commandHandler.invalidArguments(message);

		let image = await this.utils.fetchImage(images[0]);
		if (image instanceof Error) return this.utils.handleCommandError(image, message);

		let amount = this.utils.isImageArg(message, args[0]) ? args[1] : args[0];
		amount = Math.max(-100, Math.min(100, parseInt(amount) || 100));

		image = image.contrast(amount / 100);

		image = await this.utils.getBufferFromJimp(image);

		message.channel.send(`\`Amount: ${amount}\``, {
			files: [{
				attachment: image,
				name: 'contrast.png'
			}]
		});
	}
};
