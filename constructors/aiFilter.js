class AiFilter {
	constructor() {
		this.wordList = require('./aiFilterWordbase.js');
	}

	check(str) {
		if (!str) return false;

		if (str.match(/:\w{1,}:|^.?[^a-z0-9 ']\w{1,}|(#|@)\w{1,}/ig))
			return false;

		let clean = str.trim().toUpperCase()
			.replace(/\s+/g, ' ')
			.replace(/CAN(')?T/g, 'CANNOT')
			.replace(/'M/g, ' AM')
			.replace(/'LL/g, ' WILL')
			.replace(/(I|YOU|HE|SHE|IT|THEY|WE)'D/g, (m, p) => `${p} WOULD`)
			.replace(/'D/, ' HAD')
			.replace(/'VE/g, ' HAVE')
			.replace(/\BN(')?T/g, ' NOT')
			.replace(/[^A-Z ]/g, '')
			.replace(/WONT/g, 'WILL NOT')
			.replace(/THATS/g, 'THAT IS')
			.replace(/\b {2,}\b/g, ' ');

		let spl = clean.split(' ');

		let vocabulary = [];
		for (const word of spl) {
			if (word.length == 0)
				return false;

			if (!vocabulary.includes(word))
				vocabulary.push(word);
		}

		let expectedVocabSize = spl.length / 3;
		if (vocabulary.length < expectedVocabSize)
			return false;

		for (const word of vocabulary)
			if (!this.wordList.includes(word))
				return false;

		return true;
	}
}

module.exports = AiFilter;
