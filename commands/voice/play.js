module.exports = {
	description: 'Plays a song or adds it to the queue',
	category: 'Voice',
	args: '(query..)',
	cooldown: 10000,
	run: async function(message, args, argsString) {
		if(!argsString) return this.commandHandler.invalidArguments(message);

		const voiceChannel = message.member.voiceChannel;
		if(!voiceChannel) return message.channel.send(':x: Please be in a voice channel first!');

		if(message.guild.members.get(this.client.user.id).voiceChannel && message.guild.members.get(this.client.user.id).voiceChannel.id !== voiceChannel.id) return message.channel.send(':x: I am already playing in another channel!');

		const ytRequest = await this.request(`https://www.googleapis.com/youtube/v3/search?type=video&part=snippet&q=${encodeURI(argsString)}&key=${encodeURI(this.botCfg.youtubeApiKey)}`, {
			method: 'GET'
		});

		let body = JSON.parse(ytRequest.body);
		let video = body.items[0];

		if(!video) return message.channel.send(':x: The requested video could not be found!');

		const connnection = await voiceChannel.join();

		let playSong = url => {
			const stream = this.ytdl(url, {
				filter: 'audioonly'
			});

			const dispatcher = connnection.playStream(stream);
			this.voiceStreams.set(message.guild.id, dispatcher);

			dispatcher.on('end', () => {
				if(this.songQueues.has(message.guild.id) && this.songQueues.get(message.guild.id).length !== 0) {
					let currentSong = this.songQueues.get(message.guild.id)[0];

					playSong(currentSong.url);
					message.channel.send(`Now playing: \`${currentSong.video.title}\` by \`${currentSong.video.author}\`\nQueued by \`${this.client.users.has(currentSong.user) ? this.client.users.get(currentSong.user).tag : 'Unknown#0000'}\`\n\nURL: <${currentSong.url}>`);
					this.songQueues.set(message.guild.id, (this.songQueues.get(message.guild.id).splice(1)));
				} else {
					message.channel.send(':stop_button: No more songs in queue, leaving channel');
					this.songQueues.delete(message.guild.id);
					this.voiceStreams.delete(message.guild.id);
					voiceChannel.leave();
				}
			});
		};

		const videoUrl = `https://www.youtube.com/watch?v=${video.id.videoId}`;

		let currentSong = {
			url: videoUrl,
			user: message.author.id,
			video: {
				author: video.snippet.channelTitle,
				title: video.snippet.title
			}
		};

		if(this.voiceStreams.has(message.guild.id)) {
			let queue = this.songQueues.get(message.guild.id) || [];

			if(queue.filter((song) => song.url === currentSong.url).length > 0) return message.channel.send(`:x: This song is already queued. See the queued songs with \`${this.botCfg.prefix}queue\``);

			queue.push(currentSong);

			this.songQueues.set(message.guild.id, queue);

			message.channel.send(`Added to queue: \`${currentSong.video.title}\` by \`${currentSong.video.author}\`\nQueued by \`${this.client.users.has(currentSong.user) ? this.client.users.get(currentSong.user).tag : 'Unknown#0000'}\`\n\nURL: <${currentSong.url}>`);
		} else {
			playSong(videoUrl);
			message.channel.send(`Now playing: \`${currentSong.video.title}\` by \`${currentSong.video.author}\`\nQueued by \`${this.client.users.has(currentSong.user) ? this.client.users.get(currentSong.user).tag : 'Unknown#0000'}\`\n\nURL: <${currentSong.url}>`);
		}

	}
};
