module.exports = {
	description: 'Flips a coin. You can get get head or tails, or the coin might just keep rolling forever 😟',
	category: 'Fun',
	aliases: ['flipcoin', 'flipacoin', 'headsortails'],
	cooldown: 1000,
	run: async function (message) {
		const coin = Math.floor(Math.random() * 2);
        
		  if (coin === 0) {
		      message.channel.send('You flipped...**heads**!');
		  } else if (coin === 1) {
		    message.channel.send('You flipped...**tails**!');
		  }
	}
};
