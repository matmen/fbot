module.exports = {
	description: 'are we in france or what',
	category: 'Fun',
	aliases: ['french'],
	cooldown: 1000,
	run: async function (message) {
		const baguette = await this.utils.fetchFromAPI('baguette');

		message.channel.send({
			files: [{
				attachment: baguette,
				name: 'baguette.png'
			}]
		});
	}
};
