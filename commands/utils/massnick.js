module.exports = {
	description: 'Changes the nickname of all server members',
	category: 'Utils',
	args: '(nickname..) | clear',
	cooldown: 120000,
	run: async function (message, args, argsString) {
		if (!message.guild) return message.channel.send('Sorry, but this command cannot be executed via DM!');
		if (!message.member.hasPermission('MANAGE_GUILD') && !this.utils.isAdmin(message.author.id)) return message.channel.send(':x: Only guild administrators can mass nick members');
		if (!argsString) return this.commandHandler.invalidArguments(message);
		if (argsString.length > 32) return message.channel.send(':x: Nicknames can\'t be longer than 32 characters');

		let changedCount = 0;
		let failedCount = 0;

		if (['clear', 'remove'].includes(argsString.toLowerCase())) {

			const status = await message.channel.send(`Clearing the nicknames of \`${message.guild.memberCount}\` members...`);

			for (const member of message.guild.members.array()) {
				try {
					await member.setNickname('');
					changedCount++;
				} catch (e) {
					failedCount++;
				}

				await new Promise(r => setTimeout(r, 500));
			}

			status.delete();
			message.channel.send(`Cleared \`${changedCount}\` nicknames, failed to clear \`${failedCount}\` (Missing Permissions)`);

		} else {

			const status = await message.channel.send(`Changing the nicknames of \`${message.guild.memberCount}\` members...`);

			for (const member of message.guild.members.array()) {
				try {
					await member.setNickname(argsString);
					changedCount++;
				} catch (e) {
					failedCount++;
				}

				await new Promise(r => setTimeout(r, 500));
			}

			status.delete();
			message.channel.send(`Changed \`${changedCount}\` nicknames, failed to change \`${failedCount}\` (Missing Permissions)`);

		}
	}
};
