module.exports = {
	description: 'Converts the given argument into regional indicators',
	category: 'Fun',
	args: '(text..)',
	cooldown: 1000,
	run: function(message, args, argsString) {

		if(!argsString) return this.commandHandler.invalidArguments(message);

		const reply = this.utils.filterMentions(argsString).replace(/[A-Za-z]/g, (match) => {
			return `:regional_indicator_${match.toLowerCase()}: `;
		}).replace(/\d/g, (match) => {
			return `:${['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'][parseInt(match)]}:`;
		});

		if(reply.length > 2000) return message.channel.send('The message you tried to convert is too long, try something shorter');

		message.channel.send(reply);

	}
};
