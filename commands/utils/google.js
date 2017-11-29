module.exports = {
	description: 'Returns the results of a google search',
	category: 'Utils',
	args: '(query..)',
	aliases: ['g', 'search'],
	cooldown: 3000,
	run: async function (message, args, argsString) {
		if (!argsString) return this.commandHandler.invalidArguments(message);

		const resultRequest = await this.utils.fetchFromAPI('google', {
			args: {
				text: argsString
			}
		});

		const results = JSON.parse(resultRequest);
		const embed = new this.api.MessageEmbed();

		embed.setTitle('Google Search Results');

		embed.setAuthor(message.author.tag, message.author.displayAvatarURL({
			format: 'png',
			size: 2048
		}));

		for (const result of results.results.slice(0, 4)) {
			embed.addField(result.title, result.link);
		}

		message.channel.send({
			embed
		});
	}
};
