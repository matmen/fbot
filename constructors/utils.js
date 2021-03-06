class Utils {
	constructor(bot) {
		this.bot = bot;
	}

	filterMentions(string) {

		return string.replace(/<@&(\d+)>|<@!(\d+)>|<@(\d+)>|<#(\d+)>/g, (match, RID, NID, UID, CID) => {
			if ((UID || NID) && this.bot.client.users.has(UID || NID)) return `@${this.bot.client.users.get(UID || NID).username}`;
			if (CID && this.bot.client.channels.has(CID)) return `#${this.bot.client.channels.get(CID).name}`;

			if (RID)
				for (const server of this.bot.client.guilds.values())
					if (server.roles.has(RID)) return `@${server.roles.get(RID).name}`;

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
					if (value === 'me') {
						imageURLs.push(message.author.displayAvatarURL({
							format: 'png',
							size: 2048
						}));

						continue;
					}

					if (!message.guild) {
						if (message.author.tag.toLowerCase().includes(value.toLowerCase()) || message.author.id === value.replace(/[^\d]/g, ''))
							imageURLs.push(message.author.displayAvatarURL({
								format: 'png',
								size: 2048
							}));

						continue;
					}

					const match = this.getMemberFromString(message, value);

					if (match) imageURLs.push(match.user.displayAvatarURL({
						format: 'png',
						size: 2048
					}));
				}
			}

		if (imageURLs.length === 0) {
			const messages = await message.channel.messages.fetch({
				limit: 20
			});

			const messageAttachments = messages.filter(m => m.attachments.size > 0 && m.attachments.first().height && m.attachments.first().width);
			const linkEmbeds = messages.filter(m => m.embeds.length > 0 && m.embeds[0].type === 'image');
			const messageEmbeds = messages.filter(m => m.embeds.length > 0 && m.embeds[0].image);
			let images = [];

			for (const messageAttachment of messageAttachments.array()) images.push({
				url: messageAttachment.attachments.first().url,
				createdTimestamp: messageAttachment.createdTimestamp
			});

			for (const linkEmbed of linkEmbeds.array()) images.push({
				url: linkEmbed.embeds[0].url,
				createdTimestamp: linkEmbed.createdTimestamp
			});

			for (const messageEmbed of messageEmbeds.array()) images.push({
				url: messageEmbed.embeds[0].image.url,
				createdTimestamp: messageEmbed.createdTimestamp
			});

			images = images.sort((m1, m2) => m2.createdTimestamp - m1.createdTimestamp);

			imageURLs = images.map(i => i.url);
		}

		return imageURLs;
	}

	getMemberFromString(message, text) {
		if (!text) return;

		let mostRecentTimestamp = 0;
		let match;

		for (const member of message.guild.members.array()) {
			if (!(member.user.tag.toLowerCase().includes(text.toLowerCase())) &&
				!(member.nickname && member.nickname.toLowerCase().includes(text.toLowerCase())) &&
				!(member.user.id === text.replace(/[^\d]/g, '')) ||
				((member.lastMessage ? member.lastMessage.createdTimestamp : 0) < mostRecentTimestamp)) continue;

			mostRecentTimestamp = member.lastMessage ? member.lastMessage.createdTimestamp : 0;
			match = member;
		}

		return match;
	}

	isURL(value) {
		return /^(https?:\/\/)?.+(\..+)?\.\w+(\/[^\/]*)*$/.test(value);
	}

	isImageArg(message, value) {
		if (!value) return false;
		if (message.attachments.size > 0) return false;
		if (value === '^' || this.isURL(value)) return true;
		if (/^<:.+:\d+>$/.test(value)) return true;

		return !!this.getMemberFromString(message, value);
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

	parseTag(content, message, args) {
		content = content.replace(/{args}/gi, args.join(' '));

		const code = (content.match(/^\s*```js\n([\s\S]+)```$/) || [])[1];
		if (!code) return content;

		const guild = {
			id: message.guild.id,
			name: message.guild.name,
			icon: message.guild.icon,
			owner: {
				id: message.guild.owner.user.id,
				username: message.guild.owner.user.username,
				nickname: message.guild.owner.nickname,
				discriminator: message.guild.owner.user.discriminator,
				tag: message.guild.owner.user.tag,
				avatar: message.guild.owner.user.avatar
			},
			region: message.guild.region,
			members: {},
			channels: {}
		};

		for (const channel of message.guild.channels.array()) {
			guild.channels[channel.id] = {
				id: channel.id,
				name: channel.name,
				topic: channel.topic,
				nsfw: channel.nsfw,
				type: channel.type,
				guild
			};
		}

		for (const member of message.guild.members.array()) {
			guild.members[member.id] = {
				id: member.id,
				username: member.username,
				nickname: member.nickname,
				discriminator: member.discriminator,
				tag: member.tag,
				avatar: member.avatar,
				guild
			};
		}

		const channel = {
			id: message.channel.id,
			name: message.channel.name,
			topic: message.channel.topic,
			nsfw: message.channel.nsfw,
			type: message.channel.type,
			guild
		};

		const user = {
			id: message.author.id,
			username: message.author.username,
			nickname: message.member.nickname,
			discriminator: message.author.discriminator,
			tag: message.author.tag,
			avatar: message.author.avatar
		};

		const mentions = message.mentions.users.map(u => ({
			id: u.id,
			username: u.username,
			nickname: message.guild.member(u) && message.guild.member(u).nickname,
			discriminator: u.discriminator,
			tag: u.tag,
			avatar: u.avatar
		}));

		try {

			content = this.bot.vm.runInNewContext(code, {
				args,
				guild,
				channel,
				user,
				mentions
			}, {
				timeout: 1000
			});

			if (typeof content === 'object') content = `\`\`\`js\n${this.bot.util.inspect(content)}\`\`\``;

		} catch (err) {
			content = err;
		}

		return content + '';
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
