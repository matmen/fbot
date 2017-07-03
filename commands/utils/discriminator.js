module.exports = {
	description: 'Lists all users with the same discriminator',
	category: 'Utils',
	args: '[discriminator]',
	aliases: ['discrim'],
	cooldown: 1000,
	run: async function (message, args, argsString) {
		let discriminator = message.author.discriminator;

		if (argsString && argsString.match(/^\d{4}$/)) discriminator = argsString;	// DO NOT EVER remove this, or bad things might happen (broadcasting eval, yk?)

		let resultArray = [];
		const results = await this.client.shard.broadcastEval(`this.users.filter(u => u.discriminator === '${discriminator}').map(u => u.tag)`);

		for (const shardResult of results) resultArray = resultArray.concat(shardResult);

		message.channel.send(JSON.stringify(resultArray, null, 4), {
			code: 'js'
		});
	}
};