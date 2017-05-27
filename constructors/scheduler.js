const path = require('path');
const fs = require('fs');

class Scheduler {
	constructor(shardManager, db) {
		this.shardManager = shardManager;
		this.db = db;
	}

	loadTasks() {
		for(const fileName of fs.readdirSync('./tasks/')) {
			const task = require(path.resolve('./tasks/', fileName));
			setInterval(task.run.bind(this), task.interval);
		}
	}
}

module.exports = Scheduler;
