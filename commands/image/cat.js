module.exports = {
	description: 'Sends a random cat',
	category: 'Fun',
	cooldown: 5000,
	run: async function (message) {
		const response = await this.request('http://random.cat/meow'),
			body = JSON.parse(response.body),
			imageURL = body.file;

		message.channel.send({
			files: [{
				attachment: imageURL,
				name: 'meow.png'
			}]
		});
	}
};
