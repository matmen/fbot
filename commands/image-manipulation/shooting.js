module.exports = {
	description: 'Top causes of mass shootings',
	args: '(text..)',
	category: 'Fun',
	cooldown: 5000,
	run: async function (message, args, argsString) {
		if (!argsString) return this.commandHandler.invalidArguments(message);

		let image = await this.jimp.read('./assets/shooting/raw.png');
		const font = await this.jimp.loadFont('./assets/shooting/seguisb.fnt');

		let line = 0;
		for (const part of argsString.match(/.{1,20}/g)) {
			if (line > 5) return;
			image.print(font, 440, (455 + 24 * line), part.trim());
			line++;
		}

		image = await this.utils.getBufferFromJimp(image);

		message.channel.send({
			files: [{
				attachment: image,
				name: 'shooting.png'
			}]
		});
	}
};
