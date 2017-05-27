module.exports = {
  description: 'Create a new pastebin',
  category: 'Fun',
  args: '[unlisted] (title) (text)',
  cooldown: 1000,
  run: async function(message, args) {
    if (args.length === 0) return this.commandHandler.invalidArguments(message);

    let text, title, isPrivate = "0";

    if (args[0].toLowerCase() == 'unlisted') {
      title = args[1];
      text = args.splice(2).join(' ')
      isPrivate = "1";
    } else {
      title = args[0];
      text = args.splice(1).join(' ')
    };
    
    let reply = 'Creating Paste'
    const apiKey = this.botCfg.pastebinApiKey
    var msg = await message.channel.send(reply)
    let url = "https://pastebin.com/api/api_post.php"
    let response = await this.request(url, {
      method: 'POST',
      data: {
        api_dev_key: apiKey,
        api_paste_code: text,
        api_paste_name: title,
        api_paste_private: isPrivate,
        api_option: "paste"
      }
    });
    msg.edit((response.body.startsWith("Bad API request,") ? (":x: Error" + response.body.split("Bad API request,")[1]) : "Your paste URL is <"+response.body+">"))
  }
}
