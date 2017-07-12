class Utils {
	constructor(bot) {
		this.bot = bot;
	}

	filterMentions(string) {

		return string.replace(/<@&(\d+)>|<@!(\d+)>|<@(\d+)>|<#(\d+)>/g, (match, RID, NID, UID, CID) => {
			if (UID && this.bot.client.users.has(UID)) return `@${this.bot.client.users.get(UID).username}`;
			if (CID && this.bot.client.channels.has(CID)) return `#${this.bot.client.channels.get(CID).name}`;

			if (RID || NID) {
				for (const server of this.bot.client.guilds.values()) {
					if (RID && server.roles.has(RID)) return `@${server.roles.get(RID).name}`;
					if (NID && server.members.has(NID)) return `@${server.members.get(NID).displayName}`;
				}
			}

			if (CID) return '#deleted-channel';
			if (RID) return '@deleted-role';
			return '@invalid-user';
		});

	}

	isAdmin(userID) {
		return this.bot.botCfg.admins.includes(userID);
	}

	handleCommandError(err, msg, done) {
		if (done) done();
		console.error(`${`[Shard ${this.bot.client.shard.id}] [ERROR]`.red} Error:\n${(err && err.stack) || err}`); // eslint-disable-line no-console
		msg.channel.send(`Oh no! There was an unexpected error executing your command. Please try again later\n\`${err || 'Unknown Error'}\``);
	}

	getImagesFromMessage(message, args) {
		const imageURLs = [];

		for (const attachment of message.attachments.values()) imageURLs.push(attachment.url);
		for (const value of args) {
			if (this.isURL(value)) imageURLs.push(value);

			if (value.match(/^<:.+:\d+>$/)) {
				const id = value.match(/^<:.+:(\d+)>$/);
				if (id && id[1] && this.bot.client.emojis.has(id[1])) imageURLs.push(this.bot.client.emojis.get(id[1]).url);
			} else {
				const match = message.guild.members.find(member => {
					if (member.user.tag.toLowerCase().includes(value.toLowerCase())) return true;
					if (member.nickname && member.nickname.toLowerCase().includes(value.toLowerCase())) return true;
					if (member.user.id === value.replace(/[^\d]/g, '')) return true;
					return false;
				});

				if (match) imageURLs.push(match.user.displayAvatarURL({
					format: 'png',
					size: 2048
				}));
			}
		}

		return imageURLs;
	}

	isURL(value) {
		return /^(https?:\/\/)?.+(\..+)?\.\w+(\/[^\/]*)*$/.test(value);
	}

	isImageArg(message, value) {
		if (!value) return false;
		if (this.isURL(value)) return true;

		if (value.match(/^<:.+:\d+>$/)) {
			const id = value.match(/^<:.+:(\d+)>$/);
			if (id && id[1] && this.bot.client.emojis.has(id[1])) return true;
		} else {
			const match = message.guild.members.find(member => {
				if (member.user.tag.toLowerCase().includes(value.toLowerCase())) return true;
				if (member.nickname && member.nickname.toLowerCase().includes(value.toLowerCase())) return true;
				if (member.user.id === value.replace(/[^\d]/g, '')) return true;
				return false;
			});

			if (match) return true;
		}

		return false;
	}

	async fetchImage(url) {
		const fetched = await this.bot.fetch(url, {
			timeout: 30000,
			size: 3000000
		});

		if (!fetched.ok) return new this.bot.jimp(512, 512, 0xFFFFFFFF);

		const buffer = await fetched.buffer();

		return (await this.bot.jimp.read(buffer)) || new this.bot.jimp(512, 512, 0xFFFFFFFF);
	}

	getBufferFromJimp(img, mime) {
		return new Promise(async(resolve, reject) => {

			if (img.bitmap.width > 1024 || img.bitmap.height > 1024) img = await img.scaleToFit(1024, 1024);

			img.getBuffer(mime || this.bot.jimp.MIME_PNG, (err, buffer) => {
				if (err) reject(err);
				resolve(buffer);
			});

		});
	}

	queryDB(query, args) {
		return new Promise((resolve, reject) => {
			this.bot.db.connect((err, cli, done) => {
				if (err) return reject(err);
				cli.query(query, args || [], (err, res) => {
					done();
					if (err) return reject(err);
					resolve(res);
				});
			});
		});
	}
}

module.exports = Utils;
