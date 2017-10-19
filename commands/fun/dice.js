module.exports = {
	description: 'Rolls a six-sided dice',
	category: 'Fun',
	aliases: ['rolldice', 'rolladice', '1to6', 'onetosix', '126'],
	cooldown: 1000,
	run: async function (message) {
		const dice = Math.floor(Math.random() * 6);

		if (dice === 0) {
		    message.channel.send('You rolled...:one:!');
		}
		if (dice === 1) {
		    message.channel.send('You rolled...:two:!');
		}
		if (dice === 2) {
		    message.channel.send('You rolled...:three:!');
		}
		if (dice === 3) {
		    message.channel.send('You rolled...:four:!');
		}
		if (dice === 4) {
		    message.channel.send('You rolled...:five:!');
		}
		if (dice === 5) {
		    message.channel.send('You rolled...:six:!');
		}
	}
};
