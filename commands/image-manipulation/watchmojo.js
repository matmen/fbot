module.exports = {
	description: 'Top 10 Anime Deaths',
	args: '(@user | Attachment | URL) (text..)',
	category: 'Fun',
	cooldown: 5000,
	run: async function(message, args) {

		const images = this.utils.getImagesFromMessage(message, args);

		if(images.length === 0 || !this.utils.isImageArg(args[0])) return this.commandHandler.invalidArguments(message);

		let raw = await this.jimp.read('./assets/watchmojo/raw.png');
		let frame = await new this.jimp(raw.bitmap.width, raw.bitmap.height, 0x000000ff); //eslint-disable-line no-unused-vars
		let image = await this.utils.fetchImage(images[0]);
		image = await image.resize(this.jimp.AUTO, 480);
		frame = await frame.composite(image, (frame.bitmap.width / 2 - image.bitmap.width / 2), 4);
		frame = await frame.composite(raw, 0, 0);

		const font = await this.jimp.loadFont('./assets/watchmojo/roboto.fnt');
		let text = this.utils.isImageArg(args[0]) ? args.slice(1).join(' ') : args.join(' ');
		text = this.utils.filterMentions(text);

		frame.print(font, 12, 500, text);

		image = await this.utils.getBufferFromJimp(frame);

		message.channel.send({
			files: [{
				attachment: image,
				name: 'watchmojo.png'
			}]
		});

	}
};
