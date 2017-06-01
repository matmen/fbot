module.exports = {
	description: 'Resets the local copy and pulls the current master version',
	category: 'Botadmin',
	cooldown: 1000,
	adminOnly: true,
	run: async function(message) {

		const startTime = Date.now();
		const status = await message.channel.send(':clock1: Updating..');
		this.childProcess.execSync('git reset --hard');
		this.childProcess.execSync('git pull origin master');
		this.commands = this.resourceLoader.loadCommands();
		status.edit(`:white_check_mark: Done! Updated in \`${Date.now() - startTime}ms\`\nYou might want to restart all shards now. There are ${this.songQueues.size} active song queues.`);

	}
};
