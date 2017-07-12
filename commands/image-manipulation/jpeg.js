module.exports = {
	description: 'sorry there was an error displaying this message',
	args: '(@user | Attachment | URL)',
	aliases: ['jpg'],
	category: 'Fun',
	cooldown: 5000,
	run: async function (message, args) {
		const images = this.utils.getImagesFromMessage(message, args);

		if (images.length === 0) return this.commandHandler.invalidArguments(message);

		let image = await this.utils.fetchImage(images[0]);
		image = await image.quality(1);
		image = await this.utils.getBufferFromJimp(image, 'image/jpeg');

		message.channel.send({
			files: [{
				attachment: image,
				name: 'jpeg.jpg'
			}]
		});
	}
};
