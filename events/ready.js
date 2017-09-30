module.exports = function () {

	this.client.once('ready', () => {
		console.log(`${`[Shard ${this.client.shard.id}] [RUNNER]`.red} Ready for commands, serving ${this.client.guilds.size.toString().cyan} guilds`); // eslint-disable-line no-console
		this.client.user.setActivity(this.botCfg.messages.playing);
	});

};
