module.exports = {
	description: 'tRAnSfOrMs tExT iNto sPoNgEmOcK fOrMaT.',
	aliases: ['mock'],
	category: 'Fun',
	args: '(text..)',
	cooldown: 1000,
	run: async function (message, args, argsString) {
		if (!argsString) return this.commandHandler.invalidArguments(message);

		let text = [];

		for (const char of this.utils.filterMentions(argsString).split(''))
			text.push(Math.random() >= 0.5 ? char.toUpperCase() : char.toLowerCase());

		message.channel.send(text.join(''));
	}
};
