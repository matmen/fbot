module.exports = {
	description: 'Replies with the bot\'s uptime',
	category: 'Utils',
	args: '(text)',
	cooldown: 1000,
	run: async function (message) {
		message.channel.send(`I've been running for \`${this.hd(this.client.uptime, {round: true})}\``);
	}
};
