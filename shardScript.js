require('colors');
const api = require('discord.js');

const ResourceLoader = require('./constructors/resourceLoader.js');
const CommandHandler = require('./constructors/commandHandler.js');
const Utils = require('./constructors/utils.js');
const discordCfg = require('./configs/discord.json');
const botCfg = require('./configs/bot.json');
const dbCfg = require('./configs/database.json');

process.on('unhandledRejection', (err) => {
	if(!err || [4, 5].includes(Math.floor(err.code / 100))) return;
	console.err(`${'[ERR]'.red} Unhandled rejection:\n${(err && err.stack) || err}`); // eslint-disable-line no-console
});

class Bot {

	constructor() {
		this.api = api;
		this.discordCfg = discordCfg;
		this.botCfg = botCfg;
		this.dbCfg = dbCfg;

		this.resourceLoader = new ResourceLoader(this);
		this.commandHandler = new CommandHandler(this);
		this.utils = new Utils(this);

		this.client = new api.Client(discordCfg);

		this.resourceLoader.loadEvents();
		this.resourceLoader.loadDependencies();
		this.commands = this.resourceLoader.loadCommands();
		this.db = this.resourceLoader.createDbInstance();

		this.commandCooldowns = new api.Collection();
		this.songQueues = new api.Collection();
		this.voiceStreams = new api.Collection();
		this.playingSongs = new api.Collection();

		this.commandHandler.registerHandler();

		this.client.login(discordCfg.token);
	}

}

module.exports = new Bot();
