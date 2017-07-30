module.exports = {
	description: 'Im fast as fuck, 🅱oi',
	args: '(@user | Attachment | URL)',
	aliases: ['keem'],
	category: 'Fun',
	cooldown: 5000,
	run: async function (message, args) {
		const images = await this.utils.getImagesFromMessage(message, args);

		if (images.length === 0) return this.commandHandler.invalidArguments(message);

		const image = await this.utils.fetchFromAPI('keemstar', {
			images
		});

		message.channel.send({
			files: [{
				attachment: image,
				name: 'memestar.png'
			}]
		});
	}
};
