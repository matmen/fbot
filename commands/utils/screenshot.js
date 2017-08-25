const headers = new Map([
	['Accept-Language', 'en-US'],
	['Content-Language', 'en-US']
]);

module.exports = {
	description: 'Takes a screenshot of a web page',
	category: 'Utils',
	args: '(URL..)',
	aliases: ['ss', 'webshot'],
	cooldown: 3000,
	run: async function (message, args, argsString) {
		if (!argsString) return this.commandHandler.invalidArguments(message);
		if (!/^https?:\/\//.test(argsString)) argsString = `http://${argsString}`;

		const browser = await this.puppeteer.launch({
			args: ['--no-sandbox'],
			ignoreHTTPSErrors: true
		});

		setTimeout(() => {
			browser.close();
		}, 30000);

		const page = await browser.newPage();
		await page.setJavaScriptEnabled(false);
		page.setExtraHTTPHeaders(headers);

		await page.goto(argsString);
		const result = await page.screenshot();

		browser.close();

		message.channel.send({
			files: [{
				attachment: result,
				name: 'screenshot.png'
			}]
		});
	}
};
