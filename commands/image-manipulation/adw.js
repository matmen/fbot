module.exports = {
	description: 'Taking out the trash',
	args: '(@user | Attachment | URL)',
	aliases: ['walk', 'trash'],
	category: 'Fun',
	cooldown: 5000,
	run: async function (message, args) {
		const images = await this.utils.getImagesFromMessage(message, args);

		if (images.length === 0) return this.commandHandler.invalidArguments(message);

		const image = await this.utils.fetchFromAPI('adw', {
			images
		});

		message.channel.send({
			files: [{
				attachment: image,
				name: 'trash.png'
			}]
		});
	}
};
