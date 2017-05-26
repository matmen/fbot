module.exports = {
	description: 'Replies with the client\'s pings',
	category: 'Fun',
	args: '(text)',
	cooldown: 1000,
	run: async function(message) {

		const startTime = Date.now();
		message.channel.send(`:cloud: Websocket-Ping: \`${Math.round(this.client.ping)}ms\`\n:pencil: Websocket-Ping: \`Pinging..\``)
			.then(m => m.edit(`:cloud: Websocket-Ping: \`${Math.round(this.client.ping)}ms\`\n:pencil: Message-Ping: \`${Date.now() - startTime}ms\``));

	}
};
