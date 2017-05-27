module.exports = {
  description: 'Returns your video queue',
  category: 'Fun',
  args: 'NONE',
  cooldown: 1000,
  run: async function(message, args) {
    let queue = this.songQueue.get(message.channel.id)
    if (queue) {
      let reply = "**SONG QUEUE**"
      for(var x of queue) {
        reply += "\n#**"+queue.indexOf(x) + "** - `" + x.video.title + "` by `" + x.video.author + "` requested by `" + x.video.title + "`"
      }
      message.channel.send(reply)
    } else {
      message.channel.send("You have no songs in your queue ;( add some with "+this.botCfg.prefix+"play")
    }
  }
}