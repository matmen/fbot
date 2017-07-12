module.exports = {
	description: 'are we in france or what',
	category: 'Fun',
	aliases: ['french'],
	cooldown: 1000,
	run: async function (message) {
		const baguettes = this.fs.readdirSync('./assets/baguette/');
		const baguetteName = baguettes[Math.floor(Math.random() * baguettes.length)];

		message.channel.send({
			files: [{
				attachment: './assets/baguette/' + baguetteName,
				name: 'baguette.' + baguetteName.replace(/.+\./, '')
			}]
		});
	}
};
