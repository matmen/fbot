require('colors');
const api = require('discord.js');
const discordCfg = require('./configs/discord.json');
const botCfg = require('./configs/bot.json');
const prepareDb = require('./constructors/prepareDb.js');
const createTables = require('./constructors/createTables.js');
const WebHelper = require('./constructors/webHelper.js');

const shardManager = new api.ShardingManager('./shardScript.js', {
	token: discordCfg.token,
	totalShards: 2
});

const webHelper = new WebHelper(shardManager);

if(process.argv.includes('--prepare')) {

	console.log(`${'[Shard M] [DB]'.red} Preparing database..`); // eslint-disable-line no-console

	prepareDb().then(() => {
		console.log(`${'[Shard M] [DB]'.red} Database prepared! You can now run the bot`); // eslint-disable-line no-console
		process.exit();
	}).catch((err) => {
		throw err;
	});

} else {

	createTables();

	console.log(`${'[Shard M] [LAUNCH]'.red} Launching ${shardManager.totalShards.toString().cyan} shards, going to take ${`~${(isNaN(shardManager.totalShards) ? 0 : shardManager.totalShards - 1) * 7.5}s`.cyan}`); // eslint-disable-line no-console
	shardManager.spawn();
	if(!botCfg.disableWebHelper) webHelper.listen();

}
