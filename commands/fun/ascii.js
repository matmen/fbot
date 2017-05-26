module.exports = {
	description: 'Converts text to ASCII',
	category: 'Fun',
	args: '(text)',
	cooldown: 1000,
	run: async function(message, args, argsString) {

		if(!argsString) return this.commandHandler.invalidArguments(message);

		const text = this.utils.filterMentions(argsString).match(/.{1,15}/g).join('\n');

		const asciiText = this.figlet.textSync(text);

		if(asciiText.length > 2000) return message.channel.send('The message you tried to convert is too long, try something shorter');

		message.channel.send(asciiText, {
			code: true
		});

	}
};
