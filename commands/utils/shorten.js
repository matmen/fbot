module.exports = {
	description: 'Create a new pastebin',
	category: 'Fun',
	aliases: ['pastebin'],
	args: '(url)',
	cooldown: 1000,
	run: async function(message, args) {
		if(args.length === 0 || args.length > 1) return this.commandHandler.invalidArguments(message);

		let unlisted = args[0] === 'true';
		let title = args[unlisted ? 1 : 0];
		let text = args.slice(unlisted ? 2 : 1).join(' ');

		var msg = await message.channel.send('Shortening URL..');

    let url = args[0]

    if (!this.utils.isURL(url)) return message.edit(":x: Invalid URL")

		let response = await this.request(`https://api-ssl.bitly.com/v3/shorten?login=${this.botCfg.bitlyLogin}&apiKey=${this.botCfg.bitlyApiKey}&longUrl=${url}&format=txt`, {
			method: 'GET'
		});

    let shortenedUrl = `http://b.dw.gl/${response.body.split("http://bit.ly/")[1]}`
    console.log(response);

		msg.edit(`Your paste has been created at <${shortenedUrl}>`);
	}
};
