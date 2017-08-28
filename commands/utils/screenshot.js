module.exports = {
	description: 'Takes a screenshot of a web page',
	category: 'Utils',
	args: '(URL..)',
	aliases: ['ss', 'webshot'],
	cooldown: 3000,
	run: async function (message, args, argsString) {
		if (!argsString) return this.commandHandler.invalidArguments(message);

		const image = await this.utils.fetchFromAPI('screenshot', {
			args: {
				text: argsString
			}
		});

		message.channel.send({
			files: [{
				attachment: image,
				name: 'screenshot.png'
			}]
		});
	}
};
