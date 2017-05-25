module.exports = function() {

	this.client.on('reconnecting', () => {
		console.log(`${`[Shard ${this.client.shard.id}] [RUNNER]`.red} Disconnected, trying to reconnect..`); // eslint-disable-line no-console
	});

};
