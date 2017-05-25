const request = require('async-request')
module.exports = {
	description: 'Returns a random meme from /r/memes',
	category: 'Fun',
	cooldown: 20 * 1000,
	run: async function(message, args) {

		let response = await request('https://www.reddit.com/r/memes/new.json?sort=new')
		try {
			let body = JSON.parse(response.body),
				children = body.data.children
			let imageURL = children[Math.floor(Math.random() * children.length)].data.preview.images[0].source.url

			message.channel.send(
				{
					files: [
						{attachment: imageURL, name: 'meme.png'}
					]
				}
			);			
		} catch(err) {
			console.log(err)
		}
	}
};
