module.exports = {
	description: 'Sends a random dog',
	category: 'Fun',
	cooldown: 5000,
	run: async function (message) {
		const response = await this.request('https://random.dog/woof.json'),
			body = JSON.parse(response.body),
			imageURL = body.url;

		message.channel.send({
			files: [{
				attachment: imageURL,
				name: 'b0rk.png'
			}]
		});
	}
};
