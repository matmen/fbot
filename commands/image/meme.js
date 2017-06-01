const subs = ['memes', 'me_irl', 'funny'];
const sortings = ['new', 'top', 'controversial'];

module.exports = {
	description: 'Sends a random meme',
	category: 'Fun',
	cooldown: 5000,
	run: async function(message) {

		const response = await this.request(`https://www.reddit.com/r/${subs[Math.floor(Math.random() * subs.length)]}/${sortings[Math.floor(Math.random() * sortings.length)]}.json`),
			body = JSON.parse(response.body),
			children = body.data.children,
			childData = children[Math.floor(Math.random() * children.length)].data,
			imageURL = childData.preview.images[0].source.url;

		message.channel.send(`Title: \`${childData.title}\`\nPosted by \`/u/${childData.author}\` in \`/${childData.subreddit_name_prefixed}\``, {
			files: [{
				attachment: imageURL,
				name: 'meme.png'
			}]
		});

	}
};
