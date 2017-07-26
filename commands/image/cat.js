module.exports = {
	description: 'Sends a random cat',
	category: 'Fun',
	aliases: ['pussy'],
	cooldown: 5000,
	run: async function (message) {
		const response = await this.request('http://random.cat/meow');
		const body = JSON.parse(response.body);

		message.channel.send({
			files: [{
				attachment: body.file,
				name: 'meow.png'
			}]
		});
	}
};
