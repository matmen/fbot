module.exports = {
	description: 'we\'re gonna build a pond and let africa pay for it',
	category: 'Fun',
	cooldown: 1000,
	run: async function (message) {
		const trump = await this.utils.fetchFromAPI('trump');

		message.channel.send({
			files: [{
				attachment: trump,
				name: 'trump.png'
			}]
		});
	}
};
