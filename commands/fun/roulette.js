module.exports = {
	description: 'Plays a round of russian roulette',
	category: 'Fun',
	args: '(spin or shoot)',
	cooldown: 1000,
	run: async function(message, args, argsString) {

		if(!argsString) return this.commandHandler.invalidArguments(message);
		if(argsString !== "shoot" || argsString !== "spin") return this.commandHandler.invalidArguments(message)
		const revolverQ = await this.utils.queryDB('SELECT FROM settings WHERE serverID = $1 AND setting = $2', [message.guild.id, 'revolver']);
		const prefixResult = await this.utils.queryDB('SELECT value FROM settings WHERE setting = $1 AND server = $2', ['prefix', message.guild.id]);
		const prefix = prefixResult.rowCount > 0 ? prefixResult.rows[0].value : this.botCfg.prefix;
		var chamber = countQuery.rowCount >= 1 ? countQuery.rows[0].value : 0;
		if(argsString == "shoot") {
			if(chamber-- < 0) {
				message.channel.sendMessage(`The revolver is empty. Load and spin it with ${prefix}roulette spin`)
				chamber--
			} else if (chamber-- == 0) {
				message.channel.sendMessage(`The trigger is pulled, and... 💥 🔫 **${message.author.username}** has died.`)
				chamber--
			} else {
				message.channel.sendMessage(`The trigger is pulled, and... *click* **${message.author.username}** has lived!`)
			}
		} else if (argsString == "spin") {
			chamber = Math.floor(Math.random() * 6) + 1;
			message.channel.sendMessage(`The revolver was spun. Shoot it with ${prefix}roulette shoot`)
		}
		await this.utils.queryDB('DELETE FROM settings WHERE serverID = $1 AND setting = $2', [serverID, 'revolver']);
		this.utils.queryDB('INSERT INTO settings VALUES ($1, $2, $3)', [serverID, 'revolver',  chamber]);
	}
};
