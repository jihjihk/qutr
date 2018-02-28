class PhraseNode {
	constructor(phrase) {
		this.phrase = phrase;
		this.rank = 0;
	}

	increaseRank() {
		this.rank += 1;
	}

	getPhrase() {
		return this.phrase;
	}

	getRank() {
		return this.rank;
	}
}

export default PhraseNode;
