const botCfg = require('../configs/bot.json');
const request = require('snekfetch');

module.exports = {
	interval: 10 * 60 * 1000,
	run: async function () {
		let guilds = await this.shardManager.fetchClientValues('guilds.size');

		request.post(`https://discordbots.org/api/bots/${botCfg.discordbotsID}/stats`)
			.set('Authorization', botCfg.discordbotsApiKey)
			.send({
				shards: guilds
			});
	}
};
