module.exports = {
	description: 'Creates a wheel of fortune board with the given text.',
	args: '(text..)',
	category: 'Fun',
    aliases: ['wheel', 'wheeloffortune'],
	cooldown: 5000,
	run: async function(message, args) {

		if(args.length < 2) return this.commandHandler.invalidArguments(message);

		let clue = args.shift();
		let text = args.join(' ');

        let url = 'http://atom.smasher.org/wof/word-puzzle.jpg.php?';
        const len = text.length;
        let lines = ['', '', '', '']
        //52 chars max
        const words = text.split(' ')
        let currentLine = 0;
        for (let i = 0; i < words.length; i++) {
            if ((currentLine == 0 || currentLine == 3) && lines[currentLine].length + words[i].length < 12) {
                lines[currentLine] += (lines[currentLine].length == 0 ? '' : ' ') + words[i];
            } else if ((currentLine == 1 || currentLine == 2) && lines[currentLine].length + words[i].length < 14) {
                lines[currentLine] += (lines[currentLine].length == 0 ? '' : ' ') + words[i];
            } else {
                currentLine += 1;
                lines[currentLine] += (lines[currentLine].length == 0 ? '' : ' ') + words[i];
            }
        }

        for (let i = 0; i < 4; i++) {
            lines[i] = lines[i].replace(/\s/g, '%20');
            if (i == 0)
                url += `l1=${lines[i]}`
            else
                url += `&l${i + 1}=${lines[i]}`
        }
        url += `&c=${clue}`

		message.channel.send({files: [{ attachment: url, name: "wof.png" }]});

	}
};
