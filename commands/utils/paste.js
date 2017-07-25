module.exports = {
	description: 'Create a new pastebin',
	category: 'Utils',
	aliases: ['pastebin'],
	args: '[unlisted] (title) (text..)',
	cooldown: 1000,
	run: async function (message, args) {
		if (args.length < 2) return this.commandHandler.invalidArguments(message);

		const unlisted = args[0] === 'true';
		const title = args[unlisted ? 1 : 0];
		const text = args.slice(unlisted ? 2 : 1).join(' ');

		const msg = await message.channel.send('Creating paste..');

		const response = await this.request('https://pastebin.com/api/api_post.php', {
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
