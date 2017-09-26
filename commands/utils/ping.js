module.exports = {
	description: 'Replies with the client\'s pings',
	category: 'Utils',
	cooldown: 1000,
	run: async function (message) {
		const startTime = Date.now();

		const res = await message.channel.send(`:cloud: Websocket-Ping: \`${Math.round(this.client.ping)}ms\`\n:pencil: Message-Ping: \`Pinging..\``);
		res.edit(`:cloud: Websocket-Ping: \`${Math.round(this.client.ping)}ms\`\n:pencil: Message-Ping: \`${Date.now() - startTime}ms\``);
	}
};
