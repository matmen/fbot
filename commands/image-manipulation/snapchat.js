const filterArray = ['angery', 'dog', 'dog2', 'bunny', 'cat', 'cat2', 'heart', 'flowers', 'flowers2', 'devil', 'glasses', 'moustache'];

module.exports = {
	description: 'Adds a snapchat filter to an image',
	args: `(@user | Attachment | URL) [${filterArray.join(' | ')}]`,
	category: 'Fun',
	aliases: ['thot'],
	cooldown: 5000,
	run: async function (message, args) {
		if (args.length > 0 && ['list', 'help'].includes(args[0].toLowerCase())) return message.channel.send(`Available filters:\n\`\`\`http\n${filterArray.join(', ')}\`\`\``);

		const images = await this.utils.getImagesFromMessage(message, args);
		if (images.length === 0) return this.commandHandler.invalidArguments(message);

		const image = await this.utils.fetchFromAPI('snapchat', {
			images,
			args: {
				text: this.utils.isImageArg(message, args[0]) ? args[1] : args[0]
			}
		});

		message.channel.send({
			files: [{
				attachment: image,
				name: 'snapchat.png'
			}]
		});
	}
};
