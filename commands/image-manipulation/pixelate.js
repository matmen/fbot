module.exports = {
	description: 'Pixelates the image',
	args: '(@user | Attachment | URL) [size]',
	category: 'Fun',
	cooldown: 5000,
	run: async function(message, args) {

		const images = this.utils.getImagesFromMessage(message, args);
		if(images.length === 0) return this.commandHandler.invalidArguments(message);

		let image = await this.utils.fetchImage(images[0]);

		let size = this.utils.isImageArg(args[0]) ? args[1] : args[0];
		size = Math.max(2, Math.min(Math.max(image.bitmap.width, image.bitmap.height), parseInt(size) || 10));

		image = await image.pixelate(size);

		image = await this.utils.getBufferFromJimp(image);

		message.channel.send(`\`Size: ${size}\``, {
			files: [{
				attachment: image,
				name: 'pixelate.png'
			}]
		});

	}
};
