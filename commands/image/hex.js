module.exports = {
	description: 'Replies with an image with the given hex color or a random one',
	args: '[hex]',
	category: 'Fun',
	cooldown: 5000,
	run: async function (message, args, argsString) {
		let hex = argsString.replace(/[^a-f0-9]/gi, '').substring(0, 6);
		if (!hex) hex = Math.floor(Math.random() * 0xffffff).toString(16);

		const image = await this.utils.fetchFromAPI('hex', {
			args: {
				text: hex
			}
		});

		message.channel.send(`\`#${hex}\``, {
			files: [{
				attachment: image,
				name: 'hex.png'
			}]
		});
	}
};
