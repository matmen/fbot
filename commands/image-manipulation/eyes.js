const eyesList = ['black', 'white', 'big', 'blood', 'blue', 'googly', 'green', 'horror', 'illuminati', 'money', 'normal', 'pink', 'red', 'small', 'spongebob', 'swastika', 'yellow', 'spinner'];

module.exports = {
	description: 'Replaces the eyes on a face',
	args: `(@user | Attachment | URL) [${eyesList.join(' | ')}]`,
	category: 'Fun',
	cooldown: 5000,
	run: async function (message, args) {
		if (args.length > 0 && ['list', 'help'].includes(args[0].toLowerCase())) return message.channel.send(`Available eyes:\n\`\`\`http\n${eyesList.join(', ')}\`\`\``);

		const images = await this.utils.getImagesFromMessage(message, args);
		if (images.length === 0) return this.commandHandler.invalidArguments(message);

		const image = await this.utils.fetchFromAPI('eyes', {
			images,
			args: {
				text: this.utils.isImageArg(message, args[0]) ? args[1] : args[0]
			}
		});

		message.channel.send({
			files: [{
				attachment: image,
				name: 'eyes.png'
			}]
		});
	}
};
