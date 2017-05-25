const fs = require('fs');
const path = require('path');
const postgres = require('pg');

class ResourceLoader {

	constructor(bot) {
		this.bot = bot;
	}

	loadCommands() {
		const commands = new this.bot.api.Collection();

		const loadCommandsIn = (dir) => {

			fs.readdirSync(dir).forEach((subName) => {

				if(fs.statSync(path.resolve(dir, subName)).isDirectory()) {

					loadCommandsIn(path.resolve(dir, subName));

				} else {

					let file = path.resolve(dir, subName);
					let name = subName.substring(0, subName.lastIndexOf('.')).toLowerCase();

					if(require.cache[require.resolve(file)]) delete require.cache[require.resolve(file)];

					const command = require(file);
					command.name = name;
					commands.set(name, command);

					if(command.aliases) command.aliases.forEach((alias) => {
						commands.set(alias, {
							alias: true,
							name: name
						});
					});

				}

			});

		};

		loadCommandsIn('./commands/');

		return commands;
	}

	loadEvents() {
		const eventFiles = fs.readdirSync('./events/');

		eventFiles.forEach((fileName) => {
			require(path.resolve('./events/', fileName)).call(this.bot);
		});
	}

	loadDependencies() {
		const aiFilter = require('./aiFilter.js');

		this.bot.jimp = require('jimp');
		this.bot.speedtest = require('speedtest-net');
		this.bot.fetch = require('node-fetch');
		this.bot.fs = require('fs');
		this.bot.request = require('async-request');
		this.bot.figlet = require('figlet');
		this.bot.aiFilter = new aiFilter();
	}

	createDbInstance() {
		return new postgres.Pool({
			user: this.bot.dbCfg.user,
			password: this.bot.dbCfg.password,
			database: this.bot.dbCfg.db,
			host: this.bot.dbCfg.host,
			port: this.bot.dbCfg.port,
			max: this.bot.dbCfg.pool.maxClients,
			idleTimeoutMillis: this.bot.dbCfg.idleTimeout
		});
	}

}

module.exports = ResourceLoader;
