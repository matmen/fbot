module.exports = {
	description: 'we\'re gonna build a pond and let africa pay for it',
	category: 'Fun',
	cooldown: 1000,
	run: async function (message) {
		const trumps = this.fs.readdirSync('./assets/trump/');
		const trumpName = trumps[Math.floor(Math.random() * trumps.length)];

		message.channel.send({
			files: [{
				attachment: './assets/trump/' + trumpName,
				name: 'trump.' + trumpName.replace(/.+\./, '')
			}]
		});
	}
};
