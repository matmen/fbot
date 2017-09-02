module.exports = function () {

	const cache = [];

	this.client.on('userUpdate', async(oldUser, newUser) => {
		if (!newUser.avatar || oldUser.avatar === newUser.avatar) return;
		if (cache.includes(newUser.avatar)) return;
		cache.push(newUser.avatar);

		let avatar = await this.fetch(newUser.avatarURL({
			format: 'png',
			size: 2048
		}));
		avatar = await avatar.buffer();

		this.fs.writeFile(`./web/avatars/${newUser.id}-${newUser.avatar}.png`, avatar, () => {});
	});

};
