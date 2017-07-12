module.exports = {
	description: 'Jack off to this',
	args: '(@user | Attachment | URL)',
	category: 'Fun',
	cooldown: 5000,
	run: async function (message, args) {
		const images = this.utils.getImagesFromMessage(message, args);

		if (images.length === 0) return this.commandHandler.invalidArguments(message);

		let raw = await this.jimp.read('./assets/jackoff.png');
		let image = await this.utils.fetchImage(images[0]);
		image = await image.resize(389, 294);
		image = await raw.composite(image, 52, 156);
		image = await this.utils.getBufferFromJimp(image);

		message.channel.send({
			files: [{
				attachment: image,
				name: 'jackoff.png'
			}]
		});
	}
};
