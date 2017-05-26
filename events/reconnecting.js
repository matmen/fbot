module.exports = function() {

	this.client.on('reconnecting', () => {
		console.log(`${`[Shard ${this.client.shard.id}] [RUNNER]`.red} Connection lost, reconnecting..`); // eslint-disable-line no-console
	});

};
