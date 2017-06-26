module.exports = {
	description: 'Rates the given argument',
	category: 'Fun',
	args: '(thing to rate..)',
	cooldown: 1000,
	run: async function(message, args, argsString) {

		if(!argsString) return this.commandHandler.invalidArguments(message);

		let rating = 0;
		let rated = 0;
(Math.max(rating / rated, 0), 10));

		if(message.content.match(/(dm4uz3|195856437283520513|152172984373608449|150745989836308480|138680878539735040|m(y )?l(ittle )?p(ony)?|anime|weeb|senpai|n(igger|egro)|dark skin|j(ew|ude)|furr(y|i)|bron(y|i)|minion|discord\.io)/gi)) rating = 0;

		if(message.content.match(/(matmen|254696880120791040|fbot|277411860125581312|lusid|210802688181534720|conf(useh)?|113349501212782592|tvde|183678031376809984|hitler|nazi|kkk|hydra|discord\.js)/gi)) rating = 1;

		if(message.content.match(/german|🇩🇪|deutsch/gi)) rating = 'nein';

		message.channel.send(`I'd give *${argsString}* a ${rating}/10`);

	}
};
