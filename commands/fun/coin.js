module.exports = {
	description: 'Flips a coin. You can get get head or tails, or the coin might just keep rolling forever 😟',
	category: 'Fun',
	aliases: ['flipcoin', 'flipacoin', 'headsortails'],
	cooldown: 1000,
	run: async function (message) {
		message.channel.send(`You flipped... **${Math.random() > 0.5 ? 'heads' : 'tails'}**!`);
	}
};
