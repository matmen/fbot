module.exports = {
	description: 'Converts text to ASCII',
	category: 'Fun',
	args: '(text)',
	cooldown: 1000,
	run: function(message) {

		const startTime = Date.now();
		message.channel.send(`:cloud: Websocket-Ping: \`${Math.round(this.client.ping)}ms\`\n:pencil: Websocket-Ping: \`Pinging..\``)
			.then(m => m.edit(`:cloud: Websocket-Ping: \`${Math.round(this.client.ping)}ms\`\n:pencil: Message-Ping: \`${Date.now() - startTime}ms\``));

	}
};
