module.exports = {
	description: 'Shows all shard\'s stats',
	category: 'Utils',
	run: async function(message) {

		const shardPings = await this.client.shard.fetchClientValues('ping');
		const shardGuilds = await this.client.shard.fetchClientValues('guilds.size');
		const shardUsers = await this.client.shard.fetchClientValues('users.size');

		let list = '┌──────────┬───────────┬────────┬─────────┐\n';
		list += '│ Shard ID │ WS Ping   │ Guilds │ Users   │\n';
		list += '├──────────┼───────────┼────────┼─────────┤\n';

		for(let shardID = 0; shardID < this.client.shard.count; shardID++) {
			list += `│ ${shardID}${' '.repeat(8 - shardID.toString().length)} │ ${Math.round(shardPings[shardID])}ms${' '.repeat(7 - Math.round(shardPings[shardID]).toString().length)} │ ${shardGuilds[shardID]}${' '.repeat(6 - shardGuilds[shardID].toString().length)} │ ~${shardUsers[shardID]}${' '.repeat(6 - shardUsers[shardID].toString().length)} │\n`;
		}

		const avgPing = Math.round(shardPings.reduce((p, v) => (p + v) / 2, shardPings[0]));
		const totalGuilds = shardGuilds.reduce((p, v) => p + v, 0);
		const totalUsers = shardUsers.reduce((p, v) => p + v, 0);

		list += '├──────────┼───────────┼────────┼─────────┤\n';
		list += `│ Total    │ ${avgPing}ms${' '.repeat(7 - avgPing.toString().length)} │ ${totalGuilds}${' '.repeat(6 - totalGuilds.toString().length)} │ ~${totalUsers}${' '.repeat(6 - totalUsers.toString().length)} │\n`;
		list += '└──────────┴───────────┴────────┴─────────┘';

		message.channel.send(list, {
			code: 'xl'
		});

	}
};
