module.exports = function () {

	this.client.on('messageReactionAdd', (reaction, user) => {
		if (!this.utils.isAdmin(user.id)) return;

		if (reaction.emoji.name === '❌') reaction.message.delete();
	});

};
