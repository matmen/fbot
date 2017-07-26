module.exports = {
	description: 'Sends a random dog',
	category: 'Fun',
	cooldown: 5000,
	run: async function (message) {
		const response = await this.request('https://random.dog/woof');

		message.channel.send({
			files: [{
				attachment: `https://random.dog/${response.body}`,
				name: response.body
			}]
		});
	}
};
