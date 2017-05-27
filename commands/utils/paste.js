module.exports = {
	description: 'Create a new pastebin',
	category: 'Fun',
	aliases: ['pastebin'],
	args: '[unlisted] (title) (text..)',
	cooldown: 1000,
	run: async function(message, args) {
		if(args.length < 2) return this.commandHandler.invalidArguments(message);

		let unlisted = args[0] === 'true';
		let title = args[unlisted ? 1 : 0];
		let text = args.slice(unlisted ? 2 : 1).join(' ');

		var msg = await message.channel.send('Creating paste..');

		let response = await this.request('https://pastebin.com/api/api_post.php', {
			method: 'POST',
			data: {
				api_dev_key: this.botCfg.pastebinApiKey,
				api_paste_code: text,
				api_paste_name: title,
				api_paste_private: unlisted ? '1' : '0',
				api_option: 'paste'
			}
		});

		msg.edit(`Your paste has been created at <${response.body}>`);
	}
};
