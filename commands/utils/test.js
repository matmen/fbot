module.exports = {
	description: 'A test command',
	category: 'Internal',
	args: '(none really)',
	aliases: ['testing'],
	adminOnly: true,
	run: async function(message, args, argsString) {

		const images = this.utils.getImagesFromMessage(message, args);

		message.channel.send(`\`\`\`js\n${JSON.stringify(args, null, 4)}\`\`\`\n\`\`\`\n${argsString || 'null'}\`\`\`\n\`\`\`json\n${JSON.stringify(images, null, 4)}\`\`\``);

		for(const url of images) {
			let img = await this.utils.fetchImage(url);
			img = await img.invert();
			const buffer = await this.utils.getBufferFromJimp(img);

			message.channel.send({
				files: [{
					attachment: buffer,
					name: 'test.png'
				}]
			});
		}

	}
};
