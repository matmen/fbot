module.exports = {
	description: 'Your favorite porn with the click of a button',
	args: '(@user | Attachment | URL) (text..)',
	category: 'Fun',
	cooldown: 5000,
	run: async function (message, args) {
		const images = await this.utils.getImagesFromMessage(message, args);
		let text = this.utils.isImageArg(message, args[0]) ? args.slice(1).join(' ') : args.join(' ');

		if (images.length === 0 || !text) return this.commandHandler.invalidArguments(message);

		let image = await this.utils.fetchImage(images[0]);
		if (image instanceof Error) return this.utils.handleCommandError(image, message);

		let raw = await this.jimp.read('./assets/pornhub/raw.png');
		let frame = await new this.jimp(raw.bitmap.width, raw.bitmap.height, 0x000000ff); //eslint-disable-line no-unused-vars
		image = await image.resize(this.jimp.AUTO, 550);
		frame = await frame.composite(image, (frame.bitmap.width / 2 - image.bitmap.width / 2), 114);
		frame = await frame.composite(raw, 0, 0);

		const font = await this.jimp.loadFont('./assets/pornhub/calibri.fnt');
		text = this.utils.filterMentions(text);

		frame.print(font, 26, 670, text);

		image = await this.utils.getBufferFromJimp(frame);

		message.channel.send({
			files: [{
				attachment: image,
				name: 'pornhub.png'
			}]
		});
	}
};
