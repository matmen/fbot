module.exports = function() {

	this.client.on('resume', (eventCount) => {
		console.log(`${`[Shard ${this.client.shard.id}] [RUNNER]`.red} Session resumed, replayed ${eventCount.toString().cyan} events`); // eslint-disable-line no-console
	});

};
