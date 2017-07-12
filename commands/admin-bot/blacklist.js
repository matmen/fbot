module.exports = {
	description: 'Blacklists a user, channel or guild from using commands',
	category: 'Botadmin',
	args: '(type) (id)',
	cooldown: 1000,
	adminOnly: true,
	run: async function (message, args) {
		if (args.length !== 2) return this.commandHandler.invalidArguments(message);

		const type = args[0].toLowerCase();
		if (!['user', 'channel', 'server'].includes(type)) return this.commandHandler.invalidArguments(message);

		const id = args[1].replace(/[^\d]/g, '');

		const res = await this.utils.queryDB('SELECT FROM blacklists WHERE type = $1 AND id = $2', [type, id]);

		if (res.rowCount > 0) {
			await this.utils.queryDB('DELETE FROM blacklists WHERE type = $1 AND id = $2', [type, id]);
			message.channel.send(`Successfully unblacklisted ${type} \`${id}\``);
		} else {
			await this.utils.queryDB('INSERT INTO blacklists VALUES ($1, $2)', [type, id]);
			message.channel.send(`Successfully blacklisted ${type} \`${id}\``);
		}
	}
};
