module.exports = {
	description: 'Dear matmen, please make shitty commands',
	category: 'Fun',
	aliases: ['dear'],
	args: '(recipient) (message..)',
	cooldown: 1000,
	run: async function (message, args) {
		if (args.length < 2) return this.commandHandler.invalidArguments(message);

		let to = this.utils.filterMentions(args.shift());
		let text = this.utils.filterMentions(args.join(' '));

		let closingArray = ['Yours truly', 'Yours sincerely', 'With respect', 'With love'];

		let closing = closingArray[Math.floor(Math.random() * closingArray.length)];

		message.channel.send(`Dear ${to},\n${text}\n\n${closing},\n${message.author.tag}`, {
			code: true
		});
	}
};
