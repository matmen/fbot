module.exports = {
	description: 'Reminder: Anime is not allowed on this server',
	args: '(@user | Attachment | URL) (text..)',
	category: 'Fun',
	cooldown: 5000,
	run: async function (message, args) {
		const images = await this.utils.getImagesFromMessage(message, args);
		let text = this.utils.isImageArg(message, args[0]) ? args.slice(1).join(' ') : args.join(' ');

		if (images.length === 0 || !text) return this.commandHandler.invalidArguments(message);

		const image = await this.utils.fetchFromAPI('reminder', {
			images,
			args: {
				text: this.utils.filterMentions(text)
			}
		});

		message.channel.send({
			files: [{
				attachment: image,
				name: 'reminder.png'
			}]
		});
	}
};
