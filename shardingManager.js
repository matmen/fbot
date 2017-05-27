require('colors');
const api = require('discord.js');
const postgres = require('pg');

const prepareDb = require('./constructors/prepareDb.js');
const createTables = require('./constructors/createTables.js');
const WebHelper = require('./constructors/webHelper.js');
const Scheduler = require('./constructors/scheduler.js');

const discordCfg = require('./configs/discord.json');
const botCfg = require('./configs/bot.json');
const dbCfg = require('./configs/database.json');

if(process.argv.includes('--prepare')) {

	console.log(`${'[Shard M] [DB]'.red} Preparing database..`); // eslint-disable-line no-console

	prepareDb().then(() => {
		console.log(`${'[Shard M] [DB]'.red} Database prepared! You can now run the bot`); // eslint-disable-line no-console
		process.exit();
	}).catch((err) => {
		throw err;
	});

} else {

	const shardManager = new api.ShardingManager('./shardScript.js', {
		token: discordCfg.token,
		totalShards: 2
	});

	const pgPool = new postgres.Pool({
		user: dbCfg.user,
		password: dbCfg.password,
		database: dbCfg.db,
		host: dbCfg.host,
		port: dbCfg.port,
		max: dbCfg.pool.maxClients,
		idleTimeoutMillis: dbCfg.idleTimeout
	});

	const db = {
		query: queryDB.bind(pgPool)
	};

	createTables(db);

	const webHelper = new WebHelper(shardManager, db);
	const scheduler = new Scheduler(shardManager, db);

	console.log(`${'[Shard M] [LAUNCH]'.red} Launching ${shardManager.totalShards.toString().cyan} shards, going to take ${`~${(isNaN(shardManager.totalShards) ? 0 : shardManager.totalShards - 1) * 7.5}s`.cyan}`); // eslint-disable-line no-console

	shardManager.spawn();
	scheduler.loadTasks();

	if(botCfg.disableWebHelper !== true) webHelper.listen();

}

function queryDB(query, args) {
	return new Promise((resolve, reject) => {
		this.connect((err, cli, done) => {
			if(err) return reject(err);
			cli.query(query, args || [], (err, res) => {
				done();
				if(err) return reject(err);
				resolve(res);
			});
		});
	});
}
