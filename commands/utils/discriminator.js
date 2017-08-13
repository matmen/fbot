module.exports = {
	description: 'Lists all users with the same discriminator',
	category: 'Utils',
	args: '[discriminator]',
	aliases: ['discrim'],
	cooldown: 1000,
	run: async function (message, args, argsString) {
		let discriminator = message.author.discriminator;

		if (argsString && /^\d{4}$/.test(argsString)) discriminator = argsString;

		let resultArray = [];
		const results = await this.client.shard.broadcastEval(`this.users.filter(u => u.discriminator === '${discriminator}').map(u => u.tag)`);

		for (const shardResults of results) {
			for (const tag of shardResults)
				if (!resultArray.includes(tag)) resultArray.push(tag);
		}

		message.channel.send(resultArray.join('\n') || 'No users found', {
			code: 'http'
		});
	}
};
