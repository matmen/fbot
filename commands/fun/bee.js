const script = require('../../assets/bee.json');

module.exports = {
	description: 'Sends a bee movie quote',
	category: 'Fun',
	args: '[line]',
	cooldown: 1000,
	run: function(message, args) {
		if(args.length === 1 && isNaN(args[0])) return this.commandHandler.invalidArguments(message);

		const lineNr = args[0] ? parseInt(args[0]) : Math.floor(Math.random() * script.length);
		if(lineNr < 1) return message.channel.send('The bee movie doesnt have a negative amount of lines :thinking:');
		if(lineNr > script.length) return message.channel.send('The bee movie doesnt have that many lines, try something smaller');
		const line = script[lineNr - 1];

		message.channel.send(`\`"${line}"\` (Line ${lineNr})`);
	}
};
