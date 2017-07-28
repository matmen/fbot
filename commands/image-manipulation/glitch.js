module.exports = {
	description: 'Adds a glitch effect to the image',
	args: '(@user | Attachment | URL)',
	category: 'Fun',
	cooldown: 5000,
	run: async function (message, args) {
		const images = await this.utils.getImagesFromMessage(message, args);

		if (images.length === 0) return this.commandHandler.invalidArguments(message);

		let image = await this.utils.fetchImage(images[0]);
		if (image instanceof Error) return this.utils.handleCommandError(image, message);

		let glitchLayer = await new this.jimp(image.bitmap.width, image.bitmap.height);

		let previousPixel;
		image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y) => {
			const currentPixel = this.jimp.intToRGBA(image.getPixelColor(x, y));
			if (!previousPixel) previousPixel = currentPixel;

			currentPixel.r = (currentPixel.r + previousPixel.r) / 2;
			currentPixel.g = (currentPixel.g + previousPixel.g) / 2;
			currentPixel.b = (currentPixel.b + previousPixel.b) / 2;
			currentPixel.a = (currentPixel.a + previousPixel.a) / 2;
			previousPixel = currentPixel;

			const xOffset = Math.floor(y / (image.bitmap.height / 16)) % 3 * 2;

			for (let lineWidth = 0; lineWidth <= 5; lineWidth++) {
				glitchLayer.setPixelColor(this.jimp.rgbaToInt(currentPixel.r, currentPixel.g / 2, currentPixel.b / 2, currentPixel.a), (x ** 2 % image.bitmap.width) + lineWidth + xOffset, y);
				glitchLayer.setPixelColor(this.jimp.rgbaToInt(currentPixel.r / 2, currentPixel.g, currentPixel.b / 2, currentPixel.a), (x ** 3 % image.bitmap.width) + lineWidth + xOffset, y);
				glitchLayer.setPixelColor(this.jimp.rgbaToInt(currentPixel.r / 2, currentPixel.g / 2, currentPixel.b, currentPixel.a), (x ** 4 % image.bitmap.width) + lineWidth + xOffset, y);
			}
		});

		glitchLayer = await glitchLayer.opacity(0.5);

		image = await image.composite(glitchLayer, 0, 0);
		image = await this.utils.getBufferFromJimp(image);

		message.channel.send({
			files: [{
				attachment: image,
				name: 'glitch.png'
			}]
		});
	}
};
