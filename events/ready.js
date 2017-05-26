module.exports = function() {

	this.client.on('ready', () => {
		console.log(`${`[Shard ${this.client.shard.id}] [RUNNER]`.red} Ready for commands, serving ${this.client.guilds.size.toString().cyan} guilds`); // eslint-disable-line no-console
		this.client.user.setGame(this.botCfg.messages.playing);
	});

};
