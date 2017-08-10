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
		msg.channel.send(`:x: ${err || 'Unknown Error'}`);
	}

	async getImagesFromMessage(message, args) {
		let imageURLs = [];

		for (const attachment of message.attachments.values()) imageURLs.push(attachment.url);
		if (args[0] !== '^')
			for (const value of args) {
				if (this.isURL(value)) imageURLs.push(value);

				if (/^<:.+:\d+>$/.test(value)) {
					imageURLs.push(`https://cdn.discordapp.com/emojis/${value.match(/^<:.+:(\d+)>$/)[1]}.png`);
				} else {
					const match = message.guild.members.filter(member => {
						if (member.user.tag.toLowerCase().includes(value.toLowerCase())) return true;
						if (member.nickname && member.nickname.toLowerCase().includes(value.toLowerCase())) return true;
						if (member.user.id === value.replace(/[^\d]/g, '')) return true;
						return false;
					}).sort((m1, m2) => {
						const m1Time = m1.lastMessage && m1.lastMessage.createdTimestamp || 0;
						const m2Time = m2.lastMessage && m2.lastMessage.createdTimestamp || 0;

						return m2Time - m1Time;
					}).first();

					if (match) imageURLs.push(match.user.displayAvatarURL({
						format: 'png',
						size: 2048
					}));
				}
			}

		if (imageURLs.length === 0) {
			const messages = await message.channel.fetchMessages({
				limit: 20
			});

			const messageAttachments = messages.filter(m => m.attachments.size > 0 && m.attachments.first().height && m.attachments.first().width);
			const messageEmbeds = messages.filter(m => m.embeds.length > 0 && m.embeds[0].type === 'image');
			let images = [];

			for (const messageAttachment of messageAttachments.array()) images.push({
				url: messageAttachment.attachments.first().url,
				createdTimestamp: messageAttachment.createdTimestamp
			});

			for (const messageEmbed of messageEmbeds.array()) images.push({
				url: messageEmbed.embeds[0].url,
				createdTimestamp: messageEmbed.createdTimestamp
			});

			images = images.sort((m1, m2) => m2.createdTimestamp - m1.createdTimestamp);

			imageURLs = images.map(i => i.url);
		}

		return imageURLs;
	}

	isURL(value) {
		return /^(https?:\/\/)?.+(\..+)?\.\w+(\/[^\/]*)*$/.test(value);
	}

	isImageArg(message, value) {
		if (!value) return false;
		if (message.attachments.size > 0) return false;
		if (value === '^' || this.isURL(value)) return true;

		if (/^<:.+:\d+>$/.test(value)) {
			return true;
		} else {
			const match = message.guild.members.filter(member => {
				if (member.user.tag.toLowerCase().includes(value.toLowerCase())) return true;
				if (member.nickname && member.nickname.toLowerCase().includes(value.toLowerCase())) return true;
				if (member.user.id === value.replace(/[^\d]/g, '')) return true;
				return false;
			});

			if (match.size > 0) return true;
		}

		return false;
	}

	async fetchFromAPI(endpoint, options) {
		const https = require('https');
		const agent = new https.Agent({
			rejectUnauthorized: false
		});

		const requestOptions = {
			agent,
			headers: {
				'Authorization': `Bearer ${this.bot.botCfg.apiKey}`
			}
		};

		if (options) {
			requestOptions.method = 'POST';
			requestOptions.headers['Content-Type'] = 'application/json';

			requestOptions.body = JSON.stringify({
				images: options.images,
				args: options.args
			});
		}

		const result = await this.bot.fetch(`https://localhost:3000/${endpoint}`, requestOptions);

		if (!result.ok) {
			const body = await result.json();

			let error = new Error('Could not fetch result from API');
			if (body && body.meta && body.meta.error) error = new Error(body.meta.error.message);

			return Promise.reject(error);
		} else {
			const buffer = await result.buffer();
			return buffer;
		}
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
