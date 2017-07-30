module.exports = {
	description: 'Adds a glitch effect to the image',
	args: '(@user | Attachment | URL)',
	category: 'Fun',
	cooldown: 5000,
	run: async function (message, args) {
		const images = await this.utils.getImagesFromMessage(message, args);

		if (images.length === 0) return this.commandHandler.invalidArguments(message);

		const image = await this.utils.fetchFromAPI('glitch', {
			images
		});

		message.channel.send({
			files: [{
				attachment: image,
				name: 'glitch.png'
			}]
		});
	}
};
