class Utils {
	constructor(bot) {
		this.bot = bot;
	}

	filterMentions(string) {

		return string.replace(/<@&(\d+)>|<@!(\d+)>|<@(\d+)>|<#(\d+)>/g, (match, RID, NID, UID, CID) => {
			if(UID && this.bot.client.users.has(UID)) return `@${this.client.users.get(UID).username}`;
			if(CID && this.bot.client.channels.has(CID)) return `#${this.client.channels.get(CID).name}`;

			if(RID || NID) {
				for(const server of this.bot.client.guilds.values()) {
					if(RID && server.roles.has(RID)) return `@${server.roles.get(RID).name}`;
					if(NID && server.members.has(NID)) return `@${server.members.get(NID).displayName}`;
				}
			}

			if(CID) return '#deleted-channel';
			if(RID) return '@deleted-role';
			return '@invalid-user';
		});

	}

	isAdmin(userID) {
		return this.bot.botCfg.admins.includes(userID);
	}

	handleCommandError(err, msg, done) {
		if(done) done();
		console.error(`${`[Shard ${this.bot.client.shard.id}] [ERROR]`.red} Error:\n${err}`); // eslint-disable-line no-console
		msg.channel.send(`Oh no! There was an unexpected error executing your command. Please try again later\n\`${err || 'Unknown Error'}\``);
	}

	getImagesFromMessage(message, args) {
		const imageURLs = [];

		for(const attachment of message.attachments.values()) imageURLs.push(attachment.url);
		for(const value of args) {
			if(value.match(/^(https?:\/\/)?([^\/]+\.?)*\.\w+(\/.*)*$/i)) imageURLs.push(value);

			if(value.match(/^(<@!?)?\d+>?$/)) {
				const id = value.replace(/[^\d]/g, '');
				if(this.bot.client.users.has(id) && this.bot.client.users.get(id).avatar) imageURLs.push(this.bot.client.users.get(id).avatarURL('png', 2048));
			} else if(value.match(/^<:\w+:\d+>$/)) {
				const id = value.replace(/[^\d]/g, '');
				if(this.bot.client.emojis.has(id)) imageURLs.push(this.bot.client.emojis.get(id).url);
			}
		}

		return imageURLs;
	}

	async fetchImage(url) {
		const fetched = await this.bot.fetch(url, {
			timeout: 10000,
			size: 1000000
		});

		const buffer = await fetched.buffer();

		return await this.bot.jimp.read(buffer);
	}

	getBufferFromJimp(img) {
		return new Promise((resolve, reject) => {

			img.getBuffer(this.bot.jimp.MIME_PNG, (err, buffer) => {
				if(err) reject(err);
				resolve(buffer);
			});

		});
	}
}

module.exports = Utils;
