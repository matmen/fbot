module.exports = {
	description: 'Sharpens the image',
	args: '(@user | Attachment | URL) [amount]',
	category: 'Fun',
	cooldown: 5000,
	run: async function(message, args) {

		const images = this.utils.getImagesFromMessage(message, args);
		if(images.length === 0) return this.commandHandler.invalidArguments(message);

		let image = await this.utils.fetchImage(images[0]);

		let amount = this.utils.isImageArg(args[0]) ? args[1] : args[0];
		amount = Math.max(1, Math.min(100, parseInt(amount) || 10));

		image = await image.convolution([
			[-1 * amount, -1 * amount, -1 * amount],
			[-1 * amount, amount * (amount < 20 ? 8.1 : 8.05), -1 * amount],
			[-1 * amount, -1 * amount, -1 * amount]
		]);

		image = await this.utils.getBufferFromJimp(image);

		message.channel.send(`\`Amount: ${amount}\``, {
			files: [{
				attachment: image,
				name: 'sharpen.png'
			}]
		});

	}
};
