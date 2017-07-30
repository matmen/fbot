module.exports = {
	description: 'Overlays all images over each other',
	args: '(@user | Attachment | URL)+',
	category: 'Fun',
	aliases: ['merge'],
	cooldown: 5000,
	run: async function (message, args) {
		const images = await this.utils.getImagesFromMessage(message, args);

		if (images.length < 2) return this.commandHandler.invalidArguments(message);

		const image = await this.utils.fetchFromAPI('composite', {
			images
		});

		message.channel.send({
			files: [{
				attachment: image,
				name: 'composite.png'
			}]
		});
	}
};
