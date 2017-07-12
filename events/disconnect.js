module.exports = function () {

	this.client.on('disconnect', (closeEvent) => {
		console.log(`${`[Shard ${this.client.shard.id}] [RUNNER]`.red} Connection lost with code ${closeEvent.code} (${closeEvent.reason || 'No message supplied'})`); // eslint-disable-line no-console
	});

};
