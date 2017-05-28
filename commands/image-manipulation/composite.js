module.exports = {
	description: 'Overlays all images over each other',
	args: '(@user | Attachment | URL)+',
	category: 'Fun',
	aliases: ['merge'],
	cooldown: 5000,
	run: async function(message, args) {

		const images = this.utils.getImagesFromMessage(message, args);

		if(images.length < 2) return this.commandHandler.invalidArguments(message);

		let index = 0;
		for(const imageURL of images) {
			images[index] = await this.utils.fetchImage(imageURL);
			index++;
		}

		let result;
		for(let image of images) {
			if(!result) {
				result = image;
			} else {
				image = await image.opacity(0.5);
				result.composite(await image.resize(result.bitmap.width, result.bitmap.height), 0, 0);
			}
		}

		result = await this.utils.getBufferFromJimp(result);

		message.channel.send({
			files: [{
				attachment: result,
				name: 'composite.png'
			}]
		});

	}
};
