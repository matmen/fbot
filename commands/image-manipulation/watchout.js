module.exports = {
	description: 'Watch out for a Discord user by the name of matmen',
	args: '(@user | name)',
	category: 'Fun',
	cooldown: 5000,
	run: async function (message, args, argsString) {
		if (!argsString) return this.commandHandler.invalidArguments(message);

		const image = await this.utils.fetchFromAPI('watchout', {
			args: {
				text: this.utils.filterMentions(argsString)
			}
		});

		message.channel.send({
			files: [{
				attachment: image,
				name: 'watchout.png'
			}]
		});
	}
};
