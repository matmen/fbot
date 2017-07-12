module.exports = {
	description: 'Kills/reboots the current shard',
	category: 'Botadmin',
	cooldown: 1000,
	adminOnly: true,
	run: async function (message) {
		await message.channel.send('good night');
		process.exit();
	}
};
