module.exports = {
	description: 'Changes the bot\'s prefix',
	category: 'Utils',
	args: '[*reset | *prefix]',
	cooldown: 1000,
	run: async function(message, args, argsString) {

		if(argsString) {

			if(!message.member.hasPermission('MANAGE_GUILD') && !this.utils.isAdmin(message.author.id)) return message.channel.send(':x: Only guild administrators can change the prefix');

			await this.utils.queryDB('DELETE FROM settings WHERE server = $1 AND setting = $2', [message.guild.id, 'prefix']);
			if(['reset', 'clear'].includes(argsString.toLowerCase())) {
				message.channel.send(`Prefix reset to \`${this.botCfg.prefix}\``);
			} else {
				await this.utils.queryDB('INSERT INTO settings VALUES ($1, $2, $3)', [message.guild.id, 'prefix', argsString]);
				message.channel.send(`Prefix set to \`${argsString}\``);
			}

		} else {
			const prefixResult = await this.utils.queryDB('SELECT value FROM settings WHERE setting = $1 AND server = $2', ['prefix', message.guild.id]);
			const prefix = prefixResult.rowCount > 0 ? prefixResult.rows[0].value : this.botCfg.prefix;

			message.channel.send(`Current prefix: \`${prefix}\``);
		}

	}
};
