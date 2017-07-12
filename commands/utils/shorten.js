module.exports = {
	description: 'Shortens the given URL',
	category: 'Utils',
	args: '(url)',
	aliases: ['bitly'],
	cooldown: 1000,
	run: async function (message, args, argsString) {
		if (!argsString) return this.commandHandler.invalidArguments(message);
		if (!this.utils.isURL(argsString)) return message.channel.send(':x: Invalid URL');

		const msg = await message.channel.send('Shortening..');
		const response = await this.request(`https://api-ssl.bitly.com/v3/shorten?login=${this.botCfg.bitlyLogin}&apiKey=${this.botCfg.bitlyApiKey}&longUrl=${encodeURI(argsString)}&format=txt`);
		msg.edit(`Your link has been shortened to <${response.body}>`);
	}
};
