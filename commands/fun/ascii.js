var figlet = require('figlet');
module.exports = {
	description: 'xd',
	category: 'Fun',
	args: '(text)',
	cooldown: 1000,
	run: function(message, args) {

		if(args.length === 0 || args.length > 1) return this.commandHandler.invalidArguments(message);


		figlet(args[0], function(err, data) {
		    if (err) {
		        console.log('Something went wrong...');
		        console.dir(err);
		        return;
		    }
		    if (data.length > 2000) {
				message.channel.send("Message is too long to send");
		    } else {
		    	message.channel.send(data, {
		    		code: true
		    	});
		   }
		});
	}
};
