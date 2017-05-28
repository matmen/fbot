module.exports = {
  description: 'Returns your video queue',
  category: 'Fun',
  args: 'NONE',
  cooldown: 10 * 1000,
  run: async function(message, args) {
    var voteSeconds = 10;

    let queue = this.songQueue.get(message.channel.id);

    if (message.member.hasPermission('ADMINISTRATOR')) {
      message.channel.send(`ADMIN Sudo-Skipped song, currently playing \`${queue[0].video.title}\` by \`${queue[0].video.author}\` requested by \`${queue[0].user}\``);
      this.stream.get(message.guild.id).end();
    } else {
      let xmessage = await message.channel.send(`Skip song, vote :white_check_mark: or :negative_squared_cross_mark: to vote\n Vote concludes in ${voteSeconds} seconds\n**NOTE:** Even though they appear votes DO NOT count if you are not in the voice channel`);
      await xmessage.react("✅");
      await xmessage.react("❎");

      const wait = ms => {return new Promise(res => setTimeout(res, ms))};
      await wait(voteSeconds * 1000);

      let forSkipVotes = 0, noSkipVotes = 0;

      xmessage.reactions.array().forEach(reaction => {
        reaction.users.array().forEach(user => {
          this.client.channels.array().forEach(channel => {
            if (message.channel.members.get(user.id).voiceChannel.id == channel.id) {
              if(reaction.emoji.name == "✅") {
                forSkipVotes += 1;
              } else if(reaction.emoji.name == "❎") {
                noSkipVotes += 1;
              }
            }
          });
        });
      });

      if (forSkipVotes > noSkipVotes) {
        message.channel.send(`:white_check_mark: Successfully skipped song\n${forSkipVotes}/${forSkipVotes+noSkipVotes} (${(forSkipVotes/forSkipVotes+noSkipVotes*100).toFixed(2)}%) people voted to skip it`);
        this.stream.get(message.guild.id).end();
      } else {
        message.channel.send(`:negative_squared_cross_mark: Didn't skip song\n${noSkipVotes}/${forSkipVotes+noSkipVotes} (${(noSkipVotes/forSkipVotes+noSkipVotes*100).toFixed(2)}%) people voted to keep it`);
      }
    }
  }
}
