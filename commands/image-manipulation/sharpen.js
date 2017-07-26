module.exports = {
	description: 'Sharpens the image',
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

                const newAmount = Math.pow(amount, 3) / 10000;

                image = await image.convolution([
                    [0, - (1 + newAmount), 0],
                    [- (1 + newAmount), 5 + newAmount * 4, - (1 + newAmount)],
                    [0, - (1 + newAmount), 0]
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
