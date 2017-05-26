module.exports = {
	description: 'Watch out for a Discord user by the name of matmen',
	args: '(@user | name)',
	category: 'Fun',
	cooldown: 5000,
	run: async function(message, args, argsString) {

		if(!argsString) return this.commandHandler.invalidArguments(message);

		let raw = await this.jimp.read('./assets/watchout/raw.png');
		const font = await this.jimp.loadFont('./assets/watchout/discordchat.fnt');

		const text = `Look out for a Discord user by the name of "${this.utils.filterMentions(argsString)}".\n` +
			'He is going around sending friend requests to random Discord users, and those who accept his friend requests will have their accounts DDoSed and their IP Addresses revealed to him.' +
			'Spread the word and send this to as many discord servers as you can. ' +
			'If you see this user, DO NOT accept his friend request and immediately block him.\n' +
			'And by the way, DDoSing your account can make the Discord servers reject all of you access to the server (meaning you cant use your account), ' +
			'and its kinda obvious why leaking your IP Addresses is not good. Nobody accept this user and let him in here';

		let line = 0;
		for(const part of text.match(/.{1,145}/g)) {
			raw.print(font, 69, (42 + 18 * line), part.trim());
			line++;
		}

		raw = await raw.crop(0, 0, raw.bitmap.width, 42 + (text.match(/.{1,145}/g).length + 1) * 18);
		raw = await this.utils.getBufferFromJimp(raw);

		message.channel.send({
			files: [{
				attachment: raw,
				name: 'watchmojo.png'
			}]
		});

	}
};
