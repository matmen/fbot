module.exports = {
	description: 'sorry there was an error displaying this message',
	args: '(@user | Attachment | URL)',
	aliases: ['jpg'],
	category: 'Fun',
	cooldown: 5000,
	run: async function (message, args) {
		const images = await this.utils.getImagesFromMessage(message, args);

		if (images.length === 0) return this.commandHandler.invalidArguments(message);

		const image = await this.utils.fetchFromAPI('jpeg', {
			images
		});

		message.channel.send({
			files: [{
				attachment: image,
				name: 'jpeg.jpg'
			}]
		});
	}
};
