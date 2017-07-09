module.exports = {
	description: 'Sends command help',
	category: 'Utils',
	aliases: ['info'],
	cooldown: 1000,
	run: async function(message) {

		message.channel.send('You can invite me to your server using this url:\n<http://bit.ly/add-fbot>\n\nAlso, you can join the bot\'s discord server here:\nhttps://discord.gg/aRt6zMU');

	}
};
