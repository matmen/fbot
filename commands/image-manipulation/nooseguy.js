module.exports = {
	description: 'i really want to kms',
	args: '(@user | Attachment | URL)',
	aliases: ['noose'],
	category: 'Fun',
	cooldown: 5000,
	run: async function (message, args) {
		const images = await this.utils.getImagesFromMessage(message, args);

		if (images.length === 0) return this.commandHandler.invalidArguments(message);

		const image = await this.utils.fetchFromAPI('nooseguy', {
			images
		});

		message.channel.send({
			files: [{
				attachment: image,
				name: 'nooseguy.png'
			}]
		});
	}
};
