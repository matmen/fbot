const https = require('https');
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

const botCfg = require('../configs/bot.json');

class WebHelper {

	constructor(shardManager, db) {
		this.shardManager = shardManager;
		this.db = db;
		this.commands = this.indexCommands();
	}

	listen() {
		app.use(express.static('./web/'));

		app.get('/api/stats', async(req, res) => {

			try {
				const stats = await this.db.query('SELECT * FROM stats WHERE time >= $1 ORDER BY time DESC', [Date.now() - 30 * 24 * 60 * 60 * 1000]);
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
			res.status(404);
			res.sendFile(path.resolve('./web/index.html'));
		});

		const server = https.createServer({
			pfx: fs.readFileSync('./certificate.pfx')
		}, app);

		server.listen(botCfg.websitePort);
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
