class Utils {
	constructor(bot) {
		this.bot = bot;
	}

	filterMentions(string) {

		return string.replace(/<@&(\d+)>|<@!(\d+)>|<@(\d+)>|<#(\d+)>/g, (match, RID, NID, UID, CID) => {
			if(UID && this.bot.client.users.has(UID)) return `@${this.bot.client.users.get(UID).username}`;
			if(CID && this.bot.client.channels.has(CID)) return `#${this.bot.client.channels.get(CID).name}`;

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
			if(!this.isImageArg(value)) continue;

			if(this.isURL(value)) imageURLs.push(value);

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

	isURL(value) {
		return /^(https?:\/\/)?\w+(\.\w+)?\.\w+(\/[^\/]*)*$/.test(value);
	}

	isImageArg(value) {
		return this.isURL(value) || /^(<@!?)?\d+>?$|^<:\w+:\d+>$/.test(value);
	}

	async fetchImage(url) {
		const fetched = await this.bot.fetch(url, {
			timeout: 10000,
			size: 1000000
		});

		const buffer = await fetched.buffer();

		return await this.bot.jimp.read(buffer);
	}

	getBufferFromJimp(img, mime) {
		return new Promise((resolve, reject) => {

			img.getBuffer(mime || this.bot.jimp.MIME_PNG, (err, buffer) => {
				if(err) reject(err);
				resolve(buffer);
			});

		});
	}

	queryDB(query, args) {

		return new Promise((resolve, reject) => {

			this.bot.db.connect((err, cli, done) => {
				if(err) return reject(err);

				cli.query(query, args || [], (err, res) => {
					done();
					if(err) return reject(err);
					resolve(res);
				});
			});

		});

	}
}

module.exports = Utils;
