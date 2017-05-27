module.exports = {
  description: 'Add a video to your stream queue/play a song',
  category: 'Fun',
  args: '(video search)',
  cooldown: 1000,
  run: async function(message, args) {
    const voiceChannel = message.member.voiceChannel;

    const url = "https://www.googleapis.com/youtube/v3/search?type=video&part=snippet&q=" + encodeURI(args.join(",")) + "&key=" + encodeURI(this.botCfg.youtubeApiKey)
    const ytRequest = await this.request(url, {
      method: 'GET'
    });
    try {
      let body = JSON.parse(ytRequest.body)
      let video = body.items[0]
      console.log("https://www.youtube.com/watch?v=" + video.id.videoId)
      if (!voiceChannel) return message.reply(`Please be in a voice channel first!`);
      connnection = await voiceChannel.join();
      let playSong = (url) => {
        const stream = this.ytdl(url, {
          filter: 'audioonly'
        });
        const dispatcher = connnection.playStream(stream);
        this.stream.set(message.guild.id, dispatcher)
        dispatcher.on('end', () => {
          console.log('ended song', this.songQueue.has(message.guild.id), this.songQueue.get(message.guild.id));
          if (this.songQueue.has(message.guild.id) && this.songQueue.get(message.guild.id).length !== 0) {
            console.log('more songs');
            let currentSong = this.songQueue.get(message.guild.id)[0]
            console.log(this.songQueue.get(message.guild.id), currentSong);
            playSong(currentSong.url)
            message.channel.send(":white_check_mark: SUCCESS\nplaying video `" + currentSong.video.title + "` By `" + currentSong.video.author + "`\n Requested by " + currentSong.user + "\nURL: " + "https://www.youtube.com/watch?v=" + video.id.videoId)
            this.songQueue.set(message.guild.id, (this.songQueue.get(message.guild.id).splice(1)))
          } else {
            message.channel.send("No more songs in queue, leaving channel")
            this.songQueue.delete(message.guild.id)
            voiceChannel.leave()
          }
        });
      }
      let videoUrl = "https://www.youtube.com/watch?v=" + (video.id.videoId)
      if (this.stream.has(message.guild.id)) {
        message.channel.send(":white_check_mark: SUCCESS\nAdded `" + video.snippet.title + "` By `" + video.snippet.channelTitle + "`To video queue\nURL: " + "https://www.youtube.com/watch?v=" + video.id.videoId)
        let queue = (this.songQueue.get(message.guild.id) || [])
        queue.push({
          url: videoUrl,
          user: message.author.id,
          video: {
            author: video.snippet.channelTitle,
            title: video.snippet.title
          }
        })
        this.songQueue.set(message.guild.id, queue)
        console.log(this.songQueue.get(message.guild.id));
      } else {
        message.channel.send(":white_check_mark: SUCCESS\nPlaying video `" + video.snippet.title + "` By `" + video.snippet.channelTitle + "` \nURL: " + "https://www.youtube.com/watch?v=" + video.id.videoId)
        playSong(videoUrl)
      }
    } catch (err) {
      this.client.api.channels(this.botCfg.logChannel).messages.post({
        data: {
          content: (':x:' + err)
        }
      })
      return message.channel.send(":x: There has been an error with requesting videos from youtube, please try agian later")
    }
  }
}
