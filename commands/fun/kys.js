module.exports = {
	description: 'delet yourself',
	category: 'Fun',
	aliases: ['suicide'],
	args: '(user)',
	cooldown: 1000,
	run: async function(message, args, argsString) {
		if(!argsString) return this.commandHandler.invalidArguments(message);

		const user = this.utils.filterMentions(argsString);

		const hangman = '```\n___________\n' +
			'|         |\n' +
			`|         0 <-- ${user}\n` +
			'|        /|\\\n' +
			'|        / \\\n' +
			'|\n' +
			'|```';

		message.channel.send(`${hangman}\n\nKill yourself, \`${user}\`\n<https://ropestore.org/?u=${encodeURI(user)}>`);

	}
};
