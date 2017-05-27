module.exports = {
  description: 'Leave voice channel and remove queue',
  category: 'Fun',
  args: 'NONE',
  cooldown: 1000,
  run: async function(message, args) {
    if (message.member.hasPermission('ADMINISTRATOR')) {
      if (!this.stream.has(message.guild.id)) {
        message.channel.send(":x: No stream is associated with this channel");
      } else {
        this.stream.delete(message.guild.id);
        this.songQueue.delete(message.guild.id);
        this.stream.get(message.guild.id).end();
        message.guild.members.get(this.client.user.id).voiceChannel.leave();
        message.channel.send(":white_check_mark: Left voice channel");
      }
    } else {
      message.channel.send(":x: Sorry you dont have permissions to use this command");
    }
  }
}
