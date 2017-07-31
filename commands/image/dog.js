module.exports = {
	description: 'Sends a random dog',
	category: 'Fun',
	cooldown: 5000,
	run: async function (message) {
		const dog = await this.utils.fetchFromAPI('dog');

		message.channel.send({
			files: [{
				attachment: dog,
				name: 'dog.png'
			}]
		});
	}
};
