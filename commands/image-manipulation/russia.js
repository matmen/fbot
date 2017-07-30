module.exports = {
	description: 'Adds the russian flag to the given argument',
	args: '(@user | Attachment | URL)',
	aliases: ['vodka', 'cyka'],
	category: 'Fun',
	cooldown: 5000,
	run: async function (message, args) {
		const images = await this.utils.getImagesFromMessage(message, args);

		if (images.length === 0) return this.commandHandler.invalidArguments(message);

		const image = await this.utils.fetchFromAPI('russia', {
			images
		});

		message.channel.send({
			files: [{
				attachment: image,
				name: 'russia.png'
			}]
		});
	}
};
