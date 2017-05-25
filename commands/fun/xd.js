module.exports = {
	description: 'xd',
	category: 'Fun',
	args: '(text) [text] [text]',
	cooldown: 1000,
	run: function(message, args) {

		if(args.length === 0 || args.length > 3) return this.commandHandler.invalidArguments(message);

		let xd = [this.utils.filterMentions(args[0].substring(0, 16)), this.utils.filterMentions(args[1 % args.length].substring(0, 16)), this.utils.filterMentions(args[2 % args.length].substring(0, 16))];

		const s = (x) => String.prototype.repeat.call(' ', x)

		let a = xd[0],
			b = xd[1],
			c = xd[2],
			d = ' \n'

		let reply = 
			       a + s(11) + a + s(5) + b + s(2) + c + d +
			s(2) + a + s(7)  + a + s(7) + b + s(5) + c + d +
			s(4) + a + s(3)  + a + s(9) + b + s(6) + c + d +
			s(7) + a + s(11) + s(Math.round(a.length / 2 - 1)) + b + s(6) + c + d +
			s(4) + a + s(3)  + a + s(9) + b + s(6) + c + d +
			s(2) + a + s(7)  + a + s(7) + b + s(5) + c + d +
				   a + s(11) + a + s(5) + b + s(2) + c;

		message.channel.send(reply, {
			code: true
		});

	}
};
