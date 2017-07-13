module.exports = {
	description: 'Reminder: Anime is not allowed on this server',
	args: '(@user | Attachment | URL) (text..)',
	category: 'Fun',
	cooldown: 5000,
	run: async function (message, args) {
		const images = await this.utils.getImagesFromMessage(message, args);
		let text = this.utils.isImageArg(message, args[0]) ? args.slice(1).join(' ') : args.join(' ');

		if (images.length === 0 || !text) return this.commandHandler.invalidArguments(message);

		let raw = await this.jimp.read('./assets/reminder/raw.png');
		let frame = await new this.jimp(raw.bitmap.width, raw.bitmap.height, 0xffffffff); //eslint-disable-line no-unused-vars
		let image = await this.utils.fetchImage(images[0]);
		image = await image.resize(325, 325);
		frame = await frame.composite(image, 0, 99);
		frame = await frame.composite(raw, 0, 0);

		const font = await this.jimp.loadFont('./assets/reminder/seguisb.fnt');
		text = this.utils.filterMentions(text);

		let line = 0;
		for (const part of text.match(/.{1,15}/g)) {
			if (line > 7) continue;
			frame.print(font, 370, (200 + 32 * line), part.trim());
			line++;
		}

		image = await this.utils.getBufferFromJimp(frame);

		message.channel.send({
			files: [{
				attachment: image,
				name: 'reminder.png'
			}]
		});
	}
};
