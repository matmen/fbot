module.exports = {
	description: 'Creates a wheel of fortune board with the given text',
	args: '(clue) (line1) [line2] [line3] [line4]',
	category: 'Fun',
	aliases: ['wheel'],
	cooldown: 5000,
	run: async function(message, args) {
		if(args.length < 2 || args.length > 5) return this.commandHandler.invalidArguments(message);

		let url = `http://atom.smasher.org/wof/word-puzzle.jpg.php?c=${encodeURI(args.shift())}`;

		let lineNr = 1;
		for(const line of args) {
			url += `&l${lineNr}=${encodeURI(line)}`;
			lineNr++;
		}

		message.channel.send({
			files: [{
				attachment: url,
				name: 'wof.png'
			}]
		});
	}
};
