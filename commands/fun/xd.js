module.exports = {
	description: 'xd',
	category: 'Fun',
	args: '(text) [text] [text]',
	cooldown: 1000,
	run: function(message, args) {

		if(args.length === 0 || args.length > 3) return this.commandHandler.invalidArguments(message);

		let xd = [this.utils.filterMentions(args[0].substring(0, 16)), this.utils.filterMentions(args[1 % args.length].substring(0, 16)), this.utils.filterMentions(args[2 % args.length].substring(0, 16))];

		let reply = xd[0] + '           ' + xd[0] + '     ' + xd[1] + '  ' + xd[2] + ' \n' +
			'  ' + xd[0] + '       ' + xd[0] + '       ' + xd[1] + '     ' + xd[2] + ' \n' +
			'    ' + xd[0] + '   ' + xd[0] + '         ' + xd[1] + '      ' + xd[2] + ' \n' +
			'       ' + xd[0] + '           ' + ' '.repeat(Math.round(xd[0].length / 2 - 1)) + xd[1] + '      ' + xd[2] + ' \n' +
			'    ' + xd[0] + '   ' + xd[0] + '         ' + xd[1] + '      ' + xd[2] + ' \n' +
			'  ' + xd[0] + '       ' + xd[0] + '       ' + xd[1] + '     ' + xd[2] + ' \n' +
			xd[0] + '           ' + xd[0] + '     ' + xd[1] + '  ' + xd[2];

		message.channel.send(reply, {
			code: true
		});

	}
};
