module.exports = {
	description: 'Converts text to ASCII',
	category: 'Fun',
	args: '(text)',
	cooldown: 1000,
	run: async function(message) {

		message.channel.send(`I've been running for \`${this.hd(this.client.uptime, {round: true})}\``);

	}
};
