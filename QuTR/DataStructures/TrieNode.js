class TrieNode {
	constructor() {
		this.children = {};
		this.endOfWord = false;
		this.rank = 0;
		this.word = "";
		this.concepts = {};
	}
}

export default TrieNode;
