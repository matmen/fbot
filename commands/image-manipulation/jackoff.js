module.exports = {
	description: 'Jack off to this',
	args: '(@user | Attachment | URL)',
	category: 'Fun',
	cooldown: 5000,
	run: async function (message, args) {
		const images = await this.utils.getImagesFromMessage(message, args);

		if (images.length === 0) return this.commandHandler.invalidArguments(message);

		const image = await this.utils.fetchFromAPI('jackoff', {
			images
		});

		message.channel.send({
			files: [{
				attachment: image,
				name: 'jackoff.png'
			}]
		});
	}
};
