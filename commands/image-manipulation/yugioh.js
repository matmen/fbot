module.exports = {
	description: 'Your personal YuGiOh! trading card',
	args: '(@user | Attachment | URL)',
	category: 'Fun',
	cooldown: 5000,
	run: async function (message, args) {
		const images = this.utils.getImagesFromMessage(message, args);

		if (images.length === 0 || !this.utils.isImageArg(message, args[0])) return this.commandHandler.invalidArguments(message);

		let raw = await this.jimp.read('./assets/yugioh/raw.png');
		let frame = await new this.jimp(raw.bitmap.width, raw.bitmap.height, 0x000000ff); //eslint-disable-line no-unused-vars
		let image = await this.utils.fetchImage(images[0]);
		image = await image.resize(370, 365);
		frame = await frame.composite(image, 180, 150);
		frame = await frame.composite(raw, 0, 0);

		let text = this.utils.isImageArg(message, args[0]) ? args.slice(1).join(' ') : args.join(' ');
		text = this.utils.filterMentions(text).substring(0, 28);
		const font = await this.jimp.loadFont('./assets/yugioh/yugioh.fnt');

		frame.print(font, 170, 40, text);

		image = await this.utils.getBufferFromJimp(frame);

		message.channel.send({
			files: [{
				attachment: image,
				name: 'yugioh.png'
			}]
		});
	}
};
