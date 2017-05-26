const https = require('https');
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const postgres = require('pg');

const dbCfg = require('../configs/database.json');
const botCfg = require('../configs/bot.json');

class WebHelper {

	constructor(shardManager) {
		this.shardManager = shardManager;
		this.db = this.createDbInstance();
		this.botCfg = botCfg;
		this.commands = this.indexCommands();
	}

	listen() {
		app.set('views', './web/pages/');

		app.use(express.static('./web/'));

		app.get('/api/stats', async(req, res) => {
			try {
				const stats = await this.queryDB('SELECT * FROM stats ORDER BY time DESC');
				res.end(JSON.stringify(stats.rows));
			} catch(err) {
				res.status(500);
				res.end(err.message);
			}
		});

		app.get('/api/bot', async(req, res) => {

			try {
				let guilds = await this.shardManager.fetchClientValues('guilds.size');
				let users = await this.shardManager.fetchClientValues('users.size');
				let channels = await this.shardManager.fetchClientValues('channels.size');
				guilds = guilds.reduce((all, val) => all + val, 0);
				users = users.reduce((all, val) => all + val, 0);
				channels = channels.reduce((all, val) => all + val, 0);

				res.end(JSON.stringify({
					guilds: guilds,
					users: users,
					channels: channels
				}));
			} catch(err) {
				res.status(500);

				res.end(JSON.stringify({
					error: err.message
				}));
			}

		});

		app.get('/api/commands', async(req, res) => {

			try {
				res.end(JSON.stringify(this.commands));
			} catch(err) {
				res.status(500);

				res.end(JSON.stringify({
					error: err.message
				}));
			}

		});

		app.use('/pages', (req, res) => {
			res.status(404);
			res.end('Not Found');
		});

		app.use((req, res) => {
			res.sendFile(path.resolve('./web/index.html'));
		});

		const server = https.createServer({
			pfx: fs.readFileSync('./certificate.pfx')
		}, app);

		server.listen(botCfg.websitePort);
	}

	createDbInstance() {
		return new postgres.Pool({
			user: dbCfg.user,
			password: dbCfg.password,
			database: dbCfg.db,
			host: dbCfg.host,
			port: dbCfg.port,
			max: dbCfg.pool.maxClients,
			idleTimeoutMillis: dbCfg.idleTimeout
		});
	}

	queryDB(query, args) {
		return new Promise((resolve, reject) => {
			this.db.connect((err, cli, done) => {
				if(err) return reject(err);
				cli.query(query, args || [], (err, res) => {
					done();
					if(err) return reject(err);
					resolve(res);
				});
			});
		});
	}

	indexCommands() {
		const commands = [];

		const loadCommandsIn = (dir) => {
			for(const subName of fs.readdirSync(dir)) {
				if(fs.statSync(path.resolve(dir, subName)).isDirectory()) {
					loadCommandsIn(path.resolve(dir, subName));
				} else {
					let file = path.resolve(dir, subName);
					let name = subName.substring(0, subName.lastIndexOf('.')).toLowerCase();

					const command = require(file);
					commands.push({
						name: botCfg.prefix + name,
						description: command.description,
						aliases: command.aliases,
						args: command.args,
						category: command.category
					});
				}
			}
		};

		loadCommandsIn('./commands/');

		return commands;
	}

}

module.exports = WebHelper;
