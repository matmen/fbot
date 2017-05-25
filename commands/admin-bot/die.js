module.exports = {
	description: 'Kills/reboots the current shard',
	category: 'Botadmin',
	cooldown: 1000,
	adminOnly: true,
	run: function(message) {

		message.channel.send('good night').then(() => {
			process.exit();
		});

	}
};
