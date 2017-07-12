module.exports = {
	description: 'tRAnSfOrMs tExT iNto sPoNgEmOcK fOrMaT.',
  aliases: ['mock'],
	category: 'Fun',
	args: '(text)',
	cooldown: 1000,
	run: async function(message, args, argsString) {

		if(!argsString) return this.commandHandler.invalidArguments(message);

		const text = this.utils.filterMentions(argsString).match(/.{1,15}/g).join('\n');
    
    let mockText = argsString.split('');
		
    for(let i = 0; i < mockText.length; i++){
      mockText[i] = Math.random() >= 0.5 ? mockText[i].toUpperCase() : mockText[i].toLowerCase(); 
    }

		if(mock.length > 2000) return message.channel.send('The message you tried to convert is too long, try something shorter');

		message.channel.send(mockText.join(''));

	}
};
