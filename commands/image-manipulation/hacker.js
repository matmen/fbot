module.exports = {
	description: 'Hacking in progress..',
	args: '(text..)',
	category: 'Fun',
	aliases: ['hack'],
	cooldown: 5000,
	run: async function (message, args, argsString) {
		if (!argsString) return this.commandHandler.invalidArguments(message);

		let raw = await this.jimp.read('./assets/hacker/raw.png');
		const font = await this.jimp.loadFont('./assets/hacker/ubuntu.fnt');

		let line = 0;
		for (const part of argsString.match(/.{1,32}/g)) {
			if (line > 14) continue;
			raw.print(font, 220, (260 + 12 * line), part);
			line++;
		}

		raw = await this.utils.getBufferFromJimp(raw);

		message.channel.send({
			files: [{
				attachment: raw,
				name: 'hacked.png'
			}]
		});
	}
};
