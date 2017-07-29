module.exports = {
	description: 'Adds a liquid filter to the image',
	args: '(@user | Attachment | URL)',
	category: 'Fun',
	aliases: ['magic', 'magick', 'cas', 'liquid'],
	cooldown: 5000,
	run: async function (message, args) {
		const images = await this.utils.getImagesFromMessage(message, args);

		if (images.length === 0) return this.commandHandler.invalidArguments(message);

		let image = await this.utils.fetchImage(images[0]);
		if (image instanceof Error) return this.utils.handleCommandError(image, message);

		const buffer = await this.utils.getBufferFromJimp(image);

		this.gm(buffer)
			.out('-liquid-rescale', '50%', '-liquid-rescale', '150%')
			.toBuffer('PNG', (err, buffer) => {
				if (err) return this.utils.handleCommandError(err, message);

				message.channel.send({
					files: [{
						attachment: buffer,
						name: 'magik.png'
					}]
				});
			});
	}
};
