module.exports = {
	description: 'Replies with the client\'s pings',
	category: 'Utils',
	args: '(text)',
	cooldown: 1000,
	run: async function(message) {

		const startTime = Date.now();
		message.channel.send(`:cloud: Websocket-Ping: \`${Math.round(this.client.ping)}ms\`\n:pencil: Message-Ping: \`Pinging..\``)
			.then(m => m.edit(`:cloud: Websocket-Ping: \`${Math.round(this.client.ping)}ms\`\n:pencil: Message-Ping: \`${Date.now() - startTime}ms\``));

	}
};
