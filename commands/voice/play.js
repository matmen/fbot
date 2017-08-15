const youtubeHdConfig = {
	language: 'youtube',
	round: true,
	spacer: '',
	delimiter: ' '
};

module.exports = {
	description: 'Plays a song or adds it to the queue',
	category: 'Voice',
	args: '(query..)',
	cooldown: 10000,
	run: async function (message, args, argsString) {
		if (!argsString) return this.commandHandler.invalidArguments(message);

		const voiceChannel = message.member.voiceChannel;
		if (!voiceChannel) return message.channel.send(':x: Please be in a voice channel first!');
		if (voiceChannel.permissionsFor(message.guild.me).has('CONNECT')) return message.channel.send(':x: I don\'t have permissions to join your current voice channel!');

		if (message.guild.me.voiceChannel && message.guild.me.voiceChannel.id !== voiceChannel.id) return message.channel.send(':x: I am already playing in another channel!');

		const ytRequest = await this.request(`https://www.googleapis.com/youtube/v3/search?type=video&part=snippet&q=${encodeURI(argsString)}&key=${encodeURI(this.botCfg.youtubeApiKey)}`, {
			method: 'GET'
		});

		let body = JSON.parse(ytRequest.body);
		if (!body.items) return message.channel.send(':x: The requested video could not be found!');
		let video = body.items[0];

		if (!video) return message.channel.send(':x: The requested video could not be found!');

		const videoInfoRequest = await this.request(`https://www.googleapis.com/youtube/v3/videos?id=${encodeURI(video.id.videoId)}&part=contentDetails&key=${encodeURI(this.botCfg.youtubeApiKey)}`, {
			method: 'GET'
		});

		let videoInfo = JSON.parse(videoInfoRequest.body);
		if (!videoInfo.items) return message.channel.send(':x: The requested video could not be found!');

		const pthms = videoInfo.items[0].contentDetails.duration;
		const duration = pthmsToMs(pthms);

		if (duration > 30 * 60 * 1000) return message.channel.send(':clock130: Songs can\'t be longer than 30 minutes!');

		const connnection = await voiceChannel.join();

		let playSong = url => {
			const stream = this.ytdl(url, {
				filter: 'audioonly'
			});

			const dispatcher = connnection.playStream(stream, {
				passes: 2
			});

			this.voiceStreams.set(message.guild.id, dispatcher);

			dispatcher.on('end', (reason) => {
				if (reason === undefined) return playSong(url);

				if (this.songQueues.has(message.guild.id) && this.songQueues.get(message.guild.id).length !== 0) {
					let currentSong = this.songQueues.get(message.guild.id)[0];

					this.playingSongs.set(message.guild.id, Object.assign(currentSong, {
						startedAt: Date.now()
					}));

					playSong(currentSong.url);
					message.channel.send(`Now playing: \`${currentSong.video.title}\` by \`${currentSong.video.author}\` \`[${this.hd(currentSong.video.duration, youtubeHdConfig)}]\`\nQueued by \`${this.client.users.has(currentSong.user) ? this.client.users.get(currentSong.user).tag : 'Unknown#0000'}\`\n\nURL: <${currentSong.url}>`);
					this.songQueues.set(message.guild.id, this.songQueues.get(message.guild.id).splice(1));
				} else {
					message.channel.send(':stop_button: No more songs in queue, leaving channel');
					this.songQueues.delete(message.guild.id);
					this.voiceStreams.delete(message.guild.id);
					this.playingSongs.delete(message.guild.id);
					voiceChannel.leave();
				}
			});
		};

		let currentSong = {
			url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
			user: message.author.id,
			video: {
				author: video.snippet.channelTitle,
				title: video.snippet.title,
				duration: duration
			}
		};

		if (this.voiceStreams.has(message.guild.id)) {
			let queue = this.songQueues.get(message.guild.id) || [];

			if (queue.filter((song) => song.url === currentSong.url).length > 0) return message.channel.send(`:x: This song is already queued. See the queued songs with \`${this.botCfg.prefix}queue\``);

			queue.push(currentSong);

			this.songQueues.set(message.guild.id, queue);

			message.channel.send(`Added to queue: \`${currentSong.video.title}\` by \`${currentSong.video.author}\` \`[${this.hd(currentSong.video.duration, youtubeHdConfig)}]\`\n\nURL: <${currentSong.url}>`);
		} else {
			this.playingSongs.set(message.guild.id, Object.assign(currentSong, {
				startedAt: Date.now()
			}));

			playSong(currentSong.url);
			message.channel.send(`Now playing: \`${currentSong.video.title}\` by \`${currentSong.video.author}\` \`[${this.hd(currentSong.video.duration, youtubeHdConfig)}]\`\nQueued by \`${this.client.users.has(currentSong.user) ? this.client.users.get(currentSong.user).tag : 'Unknown#0000'}\`\n\nURL: <${currentSong.url}>`);
		}

		this.utils.queryDB('INSERT INTO songs VALUES ($1, $2)', [video.id.videoId, message.author.id]);
	}
};

const pthmsToMs = (pthms) => {
	const dRegex = /(\d+)D/;
	const hRegex = /(\d+)H/;
	const mRegex = /(\d+)M/;
	const sRegex = /(\d+)S/;
	let time = 0;

	time += dRegex.test(pthms) ? parseInt(pthms.match(dRegex)[1] * 60 * 60 * 24) : 0;
	time += hRegex.test(pthms) ? parseInt(pthms.match(hRegex)[1] * 60 * 60) : 0;
	time += mRegex.test(pthms) ? parseInt(pthms.match(mRegex)[1] * 60) : 0;
	time += sRegex.test(pthms) ? parseInt(pthms.match(sRegex)[1]) : 0;

	return time * 1000;
};
