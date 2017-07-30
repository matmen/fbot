module.exports = {
	description: 'Pixelates the image',
	args: '(@user | Attachment | URL) [size]',
	category: 'Fun',
	cooldown: 5000,
	run: async function (message, args) {
		const images = await this.utils.getImagesFromMessage(message, args);
		if (images.length === 0) return this.commandHandler.invalidArguments(message);

		let size = this.utils.isImageArg(message, args[0]) ? args[1] : args[0];
		size = Math.max(2, parseInt(size) || 10);

		const image = await this.utils.fetchFromAPI('pixelate', {
			images,
			args: {
				amount: size
			}
		});

		message.channel.send(`\`Size: ${size}\``, {
			files: [{
				attachment: image,
				name: 'pixelate.png'
			}]
		});
	}
};
