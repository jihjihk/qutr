import TrieNode from './TrieNode.js';

class Trie {
	constructor() {
		this.root = new TrieNode();
	}

	insertPhrase(cID, phrase) {
		// Remove punctuation from phrase
		let punctRE = /[\u2000-\u206F\u2E00-\u2E7F\\!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g;
		let spaceRE = /\s+/g;
		let noPuncPhrase = phrase.replace(punctRE, "").replace(spaceRE, " ").toLowerCase();

		let current = this.root;
		let words = noPuncPhrase.split(" ");
		for(let i = 0; i < words.length; i++) {
			let word = words[i];
			if(word.length === 0) {
				continue;
			} else {
				for(let j = 0; j < word.length; j++) {
					let c = word[j];
					if(!current.children.hasOwnProperty(c)) {
						let node = new TrieNode();
						current.children[c] = node;
					}
					current = current.children[c];
				}
				current.endOfWord = true;
				current.word = word;

				// Add space to the end of every node and store the concept ID
				if(!current.children.hasOwnProperty(" ")) {
					current.children[" "] = new TrieNode();
				}
				current.children[" "].concepts.push(cID);
				current = this.root;	// Reset at root for word
			}
		}
	}

	wordSuggestions(prefix) {
		let suggestions = {};
		let penalty = false;
		let current = this.root;
		let pre = "";
		const prefixLength = prefix.length;
		for(let i = 0; i < prefixLength; i++) {
			let c = prefix[i];
			if(!current.children.hasOwnProperty(c)) {
				penalty = true;
				pre = prefix.substring(i);	// Search for this substring in potential suggestions
				break;
			}
			current = current.children[c];
		}
		// Breadth First Search to extract all words under a given prefix
		let queue = [];
		queue.push(current);
		while(Array.isArray(queue) && queue.length) {
			let node = queue.shift();
			if(node.endOfWord) {
				// If there is no spelling mistake, add suggestion normally
				if(!penalty) {
					suggestions[node.word] = node.children[" "].concepts;
					node.rank += 1;
				} else {
					// Otherwise, allow for only edit distance penalty
					if(Math.abs(node.word.length - prefixLength) <= 1 && node.word.indexOf(pre.substring(1)) >= 0) {
						suggestions[node.word] = node.children[" "].concepts;
						node.rank += 1;
					}
				}
			} else {
				for(let child in node.children) {
					if(node.children.hasOwnProperty(child)) {
						queue.push(node.children[child]);
					}
				}
			}
		}
		console.log(suggestions);
		return suggestions;
	}

	suggConcepts(prefix) {
		let inputWords = prefix.replace(/^\s+|\s+$/g, '').toLowerCase().split(" ");  // Remove extra whitespace and split
		let concepts = {};
		for(let i = 0; i < inputWords.length; i++) {
			let word = inputWords[i];
			let suggs = this.wordSuggestions(word);
			for(let sugg in suggs) {
				for(let j = 0; j < suggs[sugg].length; j++) {
					let concept = suggs[sugg][j];
					if (!concepts.hasOwnProperty(concept)) {
						concepts[concept] = 1;
					} else {
						if(inputWords.length > 1) {
							concepts[concept] += 1;
						}
					}
				}
			}
		}
		return this.sortObject(concepts);
	}

	// Helper function to sort an object in JS
	sortObject(obj) {
		let sortable = [];
		for(let o in obj) {
			sortable.push([o, obj[o]]);
		}
		sortable.sort(function(a, b) {
			return b[1] - a[1];
		});
		return sortable;	// Returns array of 2-tuple arrays [[c1, 2], [c2, 1], ... etc.]
	}
}

export default Trie;
