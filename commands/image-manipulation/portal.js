module.exports = {
	description: 'Noose to another galaxy',
	args: '(@user | Attachment | URL)',
	category: 'Fun',
	cooldown: 5000,
	run: async function(message, args) {

		const images = this.utils.getImagesFromMessage(message, args);

		if(images.length === 0) return this.commandHandler.invalidArguments(message);

		let raw = await this.jimp.read('./assets/portal.png');
		let frame = await new this.jimp(raw.bitmap.width, raw.bitmap.height, 0xffffffff); //eslint-disable-line no-unused-vars
		let image = await this.utils.fetchImage(images[0]);
		image = await image.resize(this.jimp.AUTO, 617);
		frame = await frame.composite(image, (raw.bitmap.width / 2 - image.bitmap.width / 2), 419);
		frame = await frame.composite(raw, 0, 0);
		image = await this.utils.getBufferFromJimp(frame);

		message.channel.send({
			files: [{
				attachment: image,
				name: 'portal.png'
			}]
		});

	}
};
