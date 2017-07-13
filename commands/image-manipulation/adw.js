module.exports = {
	description: 'Taking out the trash',
	args: '(@user | Attachment | URL)',
	aliases: ['walk', 'trash'],
	category: 'Fun',
	cooldown: 5000,
	run: async function (message, args) {
		const images = await this.utils.getImagesFromMessage(message, args);

		if (images.length === 0) return this.commandHandler.invalidArguments(message);

		let raw = await this.jimp.read('./assets/adw.png');
		let frame = await new this.jimp(raw.bitmap.width, raw.bitmap.height, 0x000000ff); //eslint-disable-line no-unused-vars
		let image = await this.utils.fetchImage(images[0]);
		image = await image.resize(128, 128);
		frame = await frame.composite(image, 384, 114);
		frame = await frame.composite(raw, 0, 0);
		image = await this.utils.getBufferFromJimp(frame);

		message.channel.send({
			files: [{
				attachment: image,
				name: 'trash.png'
			}]
		});
	}
};
