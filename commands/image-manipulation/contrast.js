module.exports = {
	description: 'Adjusts the image\'s contrast',
	args: '(@user | Attachment | URL) [amount]',
	category: 'Fun',
	cooldown: 5000,
	run: async function (message, args) {
		const images = await this.utils.getImagesFromMessage(message, args);
		if (images.length === 0) return this.commandHandler.invalidArguments(message);

		let amount = this.utils.isImageArg(message, args[0]) ? args[1] : args[0];
		amount = Math.max(-100, Math.min(100, parseInt(amount) || 100));

		const image = await this.utils.fetchFromAPI('contrast', {
			images,
			args: {
				amount: amount / 100
			}
		});

		message.channel.send(`\`Amount: ${amount}\``, {
			files: [{
				attachment: image,
				name: 'contrast.png'
			}]
		});
	}
};
