module.exports = {
	description: 'Generate a sentence based on messages that fbot received',
	args: '[depth] [input..]',
	aliases: ['ai'],
	category: 'Fun',
	cooldown: 5000,
	run: async function (message, args, argsString) {

		let text = argsString;
		let depth = parseInt(args[0]);

		if (depth) {
			text = args.slice(1, args.length).join(' ');
		} else {
			depth = 3;
		}

		const result = await this.utils.fetchFromAPI('markov/generate', {
			args: {
				text,
				depth
			}
		});

		message.channel.send(result.toString());
	}
};
