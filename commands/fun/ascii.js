var figlet = require('figlet');
module.exports = {
	description: 'Converts text to ASCII',
	category: 'Fun',
	args: '(text)',
	cooldown: 1000,
	run: function(message, args, argsString) {

		if(!argsString) return this.commandHandler.invalidArguments(message);

		figlet(this.utils.filterMentions(argsString), function(err, data) {
			if(err) return this.utils.handleCommandError(err);
			if(data.length > 2000) return message.channel.send('The message you tried to convert is too long, try something shorter');

			message.channel.send(data, {
				code: true
			});
		});
	}
};
