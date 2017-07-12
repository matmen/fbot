module.exports = {
	description: 'i really want to kms',
	args: '(@user | Attachment | URL)',
	aliases: ['noose'],
	category: 'Fun',
	cooldown: 5000,
	run: async function (message, args) {
		const images = this.utils.getImagesFromMessage(message, args);

		if (images.length === 0) return this.commandHandler.invalidArguments(message);

		let raw = await this.jimp.read('./assets/nooseguy.png');
		let frame = await new this.jimp(raw.bitmap.width, raw.bitmap.height, 0xffffffff); //eslint-disable-line no-unused-vars
		let image = await this.utils.fetchImage(images[0]);
		image = await image.resize(86, 115);
		frame = await frame.composite(image, 61, 386);
		frame = await frame.composite(raw, 0, 0);
		image = await this.utils.getBufferFromJimp(frame);

		message.channel.send({
			files: [{
				attachment: image,
				name: 'nooseguy.png'
			}]
		});
	}
};
