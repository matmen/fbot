module.exports = {
	description: 'knowyourmeme is a great site',
	args: '(@user | Attachment | URL)',
	category: 'Fun',
	cooldown: 5000,
	run: async function (message, args) {
		const images = await this.utils.getImagesFromMessage(message, args);

		if (images.length === 0) return this.commandHandler.invalidArguments(message);

		const image = await this.utils.fetchFromAPI('coolguy', {
			images
		});

		message.channel.send({
			files: [{
				attachment: image,
				name: 'coolguy.png'
			}]
		});
	}
};
