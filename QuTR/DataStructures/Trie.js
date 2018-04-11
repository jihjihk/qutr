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
    let noPuncPhrase = this.normalizeArabic(phrase.replace(punctRE, "").replace(spaceRE, " ").toLowerCase());

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
        // Add the concept ID associated with the word (checking for duplicates)
        if(!current.concepts.hasOwnProperty(cID)) current.concepts[cID] = true;
        
        current = this.root;  // Reset at root for word

        this.spellChecker.add(word);  // Add word to Spell Checker
      }
    }
  }

  // Exact is boolean to enforce exact matching or autocompletion
  traverseTrie(word, exact = true) {
    let current = this.root;
    for(let i = 0; i < word.length; i++) {
      let c = word.charAt(i);
      if(!current.children.hasOwnProperty(c)) {
        return null;
      }
      current = current.children[c];
    }
    if(current.endOfWord && exact) return current;

    // If not complete word, then auto-complete
    // Breadth First Search to extract all words under a given prefix
    let queue = [];
    for(let child in current.children) {
      if(current.children.hasOwnProperty(child)) {
        queue.push(current.children[child]);
      }
    }
    while(Array.isArray(queue) && queue.length) {
      let node = queue.shift();
      if(node.endOfWord) return node;
      else {
        for(let child in node.children) {
          if(node.children.hasOwnProperty(child)) {
            queue.push(node.children[child]);
          }
        }
      }
    }
  }

  // Helper function to convert concepts object to array
  objKeysToArray(obj) {
    let arr = [];
    for(let key in obj) arr.push(key);
    return arr;
  }

  suggConceptsHelper(prefix) {
    // Return all possible conceptIDs for three things:
    // 1. An exact match (if found) in the Trie
    // 2. Autocompleted words from the Trie with the given prefix
    // 3. Words/prefixes with an edit distance of 1
    let suggestions = { exact: [], autoCom: [], autoCorr: [] };
    let corrSuggs = this.spellChecker.search(prefix);
    if(corrSuggs.length === 0) return null; // No suggestions found.
    // 1. Exact match.
    if(corrSuggs[0].distance === 0) suggestions.exact = this.objKeysToArray(this.traverseTrie(corrSuggs[0].term).concepts);

    // 2. Autocomplete from Trie.
    let node = this.traverseTrie(prefix, false);
    if(node) suggestions.autoCom = this.objKeysToArray(node.concepts); 

    // 3. Words/prefixes within 1 edit-distance (more suggestions).
    let i = (suggestions.exact.length !== 0) ? 1 : 0; // To skip concepts from 1.
    for(i; i < corrSuggs.length; i++) {
      let sugg = corrSuggs[i];
      let word = sugg.term;
      if(suggestions.autoCom.length !== 0 && node.word === word) continue;  // To skip concepts from 2.
      let concepts = this.objKeysToArray(this.traverseTrie(word).concepts);
      suggestions.autoCorr = suggestions.autoCorr.concat(concepts);
    }
    
    return suggestions;
  }

  suggConcepts(prefix) {
    let inputWords = this.normalizeArabic(prefix.replace(/^\s+|\s+$/g, '').toLowerCase()).split(" ");  // Remove extra whitespace and split
    let concepts = {};  // Combined object for all concepts w/ count
    let suggCons = {};  // Combined object for all concepts b/ word
    for(let i = 0; i < inputWords.length; i++) {
      let word = inputWords[i];
      let suggestions = this.suggConceptsHelper(word);
      // Minimum threshold for returned conceptIDs is 5
      if(suggestions) {
        if(suggestions.exact.length > 5) {  // 1st preference is exact match.
          suggCons[word] = suggestions.exact;
          break;
        } else {
          suggCons[word] = suggestions.exact.concat(suggestions.autoCom);       // 2nd preference is autocomplete
          if(suggCons[word].length < 5) suggCons[word] = suggCons[word].concat(suggestions.autoCorr);  // 3rd is auto-correct
        }
      }
    }
    // Combine & concept IDs
    for(let pre in suggCons) {
      let cons = suggCons[pre];
      cons.forEach((conID) => {
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
    return sortable;  // Returns array of 2-tuple arrays [[c1, 2], [c2, 1], ... etc.]
  }

  normalizeArabic(phrase) {
    let normPhrase = phrase;
    // Alif
    normPhrase = normPhrase.replace(/\u0623/g, "\u0627");
    normPhrase = normPhrase.replace(/\u0625/g, "\u0627");
    normPhrase = normPhrase.replace(/\u0622/g, "\u0627");
    // Ya
    normPhrase = normPhrase.replace(/\u0649/g, "\u064A");
    // Tamar Boota
    normPhrase = normPhrase.replace(/\u0629/g, "\u0647");

    return normPhrase;
  }
}

export default Trie;
