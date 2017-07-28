const eyesList = ['blue', 'green', 'pink', 'red', 'yellow', 'swastika', 'normal'];

module.exports = {
	description: 'Replaces the eyes on a face',
	args: '(@user | Attachment | URL) [red | green | blue | yellow | pink | swastika | normal]',
	category: 'Fun',
	cooldown: 5000,
	run: async function (message, args) {
		const images = await this.utils.getImagesFromMessage(message, args);

		if (images.length === 0) return this.commandHandler.invalidArguments(message);

		let image = await this.utils.fetchImage(images[0]);
		if (image instanceof Error) return this.utils.handleCommandError(image, message);

		const faces = await this.fetch('https://api.projectoxford.ai/face/v1.0/detect?returnFaceId=false&returnFaceLandmarks=true', {
			method: 'POST',
			headers: {
				'Ocp-Apim-Subscription-Key': this.botCfg.oxfordKey, //API Key totally not stolen from NotSoBot
				'Content-Type': 'application/octet-stream'
			},
			body: await this.utils.getBufferFromJimp(image)
		}).then(r => r.json());

		if (faces.length < 1) return message.channel.send(':x: No face detected');

		const eyes = [];

		for (const face of faces) {
			eyes.push({
				x: face.faceLandmarks.pupilLeft.x,
				y: face.faceLandmarks.pupilLeft.y,
				width: face.faceLandmarks.eyeLeftInner.x - face.faceLandmarks.eyeLeftOuter.x
			});

			eyes.push({
				x: face.faceLandmarks.pupilRight.x,
				y: face.faceLandmarks.pupilRight.y,
				width: face.faceLandmarks.eyeRightOuter.x - face.faceLandmarks.eyeRightInner.x
			});
		}

		let eye = this.utils.isImageArg(message, args[0]) ? args[1] : args[0];
		if (!eye || !eyesList.includes(eye.toLowerCase())) eye = eyesList[Math.floor(Math.random() * eyesList.length)];

		const eyeImage = await this.jimp.read(`./assets/eyes/${eye}.png`);

		for (const eye of eyes) {
			let tEye = await eyeImage.clone();
			tEye.resize(eye.width * 20, this.jimp.AUTO);

			image.composite(tEye, eye.x - tEye.bitmap.width / 2, eye.y - tEye.bitmap.height / 2);
		}

		image = await this.utils.getBufferFromJimp(image);

		message.channel.send({
			files: [{
				attachment: image,
				name: 'eyes.png'
			}]
		});
	}
};
