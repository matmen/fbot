module.exports = {
	description: 'Rolls a six-sided dice',
	category: 'Fun',
	aliases: ['rolldice', 'rolladice', '1to6', 'onetosix', '126'],
	cooldown: 1000,
	run: async function (message) {
		const dice = Math.floor(Math.random() * 6);

		message.channel.send(`You rolled... :${['one', 'two', 'three', 'four', 'five', 'six'][dice]}:!`);
	}
};
