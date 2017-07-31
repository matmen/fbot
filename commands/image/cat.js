module.exports = {
	description: 'Sends a random cat',
	category: 'Fun',
	cooldown: 5000,
	run: async function (message) {
		const cat = await this.utils.fetchFromAPI('cat');

		message.channel.send({
			files: [{
				attachment: cat,
				name: 'cat.png'
			}]
		});
	}
};
