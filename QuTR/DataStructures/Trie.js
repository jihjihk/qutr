import TrieNode from './TrieNode.js';
import SymSpell from './SymSpell.js';

class Trie {
	constructor() {
		this.root = new TrieNode();
		this.spellChecker = new SymSpell({ maxDistance: 1 });
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
        		current.concepts.push(cID);	// Add the concept ID associated with the word
				current = this.root;	// Reset at root for word

				this.spellChecker.add(word);	// Add word to Spell Checker
			}
		}
	}

	traverseTrie(word) {
		let current = this.root;
		for(let i = 0; i < word.length; i++) {
			let c = word.charAt(i);
			if(!current.children.hasOwnProperty(c)) {
				return null;
			}
			current = current.children[c];
		}
		return current;
	}

	suggConceptsHelper(prefix) {
	    // Return all possible conceptIDs for three things:
	    // 1. An exact match (if found) in the Trie
	    // 2. Autocompleted words from the Trie with the given prefix
	    // 3. Words/prefixes with an edit distance of 1
		let suggestions = [];
		let penalty = false;
		let corrSuggs = this.spellChecker.search(prefix);
	    if(corrSuggs.length === 0) return []; // No suggestions found.

	    if(corrSuggs[0].distance === 0) { // 1. Exact match.
	      suggestions = this.traverseTrie(corrSuggs[0].term).concepts;
	    } else {
	      let node = this.traverseTrie(prefix);
	      if(node) suggestions = node.concepts; // 2. Autocomplete from Trie.
	      else {
	        // 3. Words/prefixes within 1 edit-distance (more suggestions).
	        corrSuggs.forEach((sugg) => {
	          let word = sugg.term;
	          let concepts = this.traverseTrie(word).concepts;
	          suggestions = suggestions.concat(concepts);
	        });
	      }
	    }
		return suggestions;
	}

	suggConcepts(prefix) {
		let inputWords = prefix.replace(/^\s+|\s+$/g, '').toLowerCase().split(" ");  // Remove extra whitespace and split
		let concepts = {};
		for(let i = 0; i < inputWords.length; i++) {
			let word = inputWords[i];
			let suggCons = this.suggConceptsHelper(word);
			// Count concept IDs
			suggCons.forEach((conID) => {
				if(!concepts.hasOwnProperty(conID)) concepts[conID] = 1;
				else {
					if(inputWords.length > 1) concepts[conID] += 1;
				}
			});
		}
		return (Object.keys(concepts).length === 0 && concepts.constructor === Object) ? [] : this.sortObject(concepts);
	}

	// Helper function to sort concept IDs by count
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
