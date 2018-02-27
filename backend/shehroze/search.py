from collections import Counter

class PhraseNode:
    def __init__(self, phrase):
        self.phrase = phrase
        self.rank = 0

    def increaseRank(self):
        self.rank += 1

    def getPhrase(self):
        return self.phrase

    def getRank(self):
        return self.rank

class PhraseDictionary:
    def __init__(self):
        self.phrases = {}

    def insertPhraseNode(self, cID, node):
        self.phrases[cID] = node

    def getPhraseNode(self, cID):
        return self.phrases[cID] if cID in self.phrases else None

class TrieNode:
    def __init__(self):
        self.children = {}
        self.endOfWord = False
        self.rank = 0
        self.word = ""
        self.concepts = []

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        current = self.root
        for c in word:
            if c not in current.children:
                #print("inserting... " + c + " for " + word)
                node = TrieNode()
                current.children[c] = node
            current = current.children[c]
        current.endOfWord = True
        current.word = word
        #print("Added word: " + current.word)

    def search(self, word):
        current = self.root
        for c in word:
            if c not in current.children:
                return False
            current = current.children[c]
        return current.endOfWord

    def wordSuggestions(self, prefix):
        suggestions = {}
        penalty = False
        current = self.root
        prefixLen = len(prefix)
        for i in range(prefixLen):
            c = prefix[i]
            if c not in current.children:
                penalty = True
                pre = prefix[i:]    # Search for this substring in potential suggestions
                break
            current = current.children[c]
        # BFS to print all words under a given prefix
        queue = []
        queue.append(current)
        while(queue):
            node = queue.pop(0)
            if node.endOfWord:
                # If there is no spelling mistake, add suggestion normally
                if not penalty:
                    suggestions[node.word] = node.children[" "].concepts
                    node.rank += 1
                else:
                    # Otherwise, allow for only edit distance penalty
                    if abs(len(node.word) - prefixLen) <= 1 and pre[1:] in node.word:
                            suggestions[node.word] = node.children[" "].concepts
                            node.rank += 1
            else:
                for child in node.children:
                    if child:
                        queue.append(node.children[child])
        # Sort suggestions based on rank here
        return suggestions

    def insertPhrase(self, cID, phrase):
        current = self.root
        words = phrase.split(" ")
        for w in words:
            for c in w:
                if c not in current.children:
                    node = TrieNode()
                    current.children[c] = node
                current = current.children[c]
            current.endOfWord = True
            current.word = w
            #print("stored: " + w)
            # Add space to the end of every node and store the concept ID
            if " " not in current.children:
                current.children[" "] = TrieNode()
            current.children[" "].concepts.append(cID)
            #print(current.children[" "].concepts)
            current = self.root # reset at root for word

    def suggConcepts(self, prefix):
        inputWords = prefix.split(" ")
        concepts = Counter()
        for word in inputWords:
            suggs = self.wordSuggestions(word)
            for sugg in suggs:
                for concept in suggs[sugg]:
                    concepts[concept] += 1
        return concepts.most_common()

    # Implement Trie Print function

def edits1(word):
    "All edits that are one edit away from `word`."
    letters    = 'abcdefghijklmnopqrstuvwxyz'
    splits     = [(word[:i], word[i:])    for i in range(len(word) + 1)]
    deletes    = [L + R[1:]               for L, R in splits if R]
    transposes = [L + R[1] + R[0] + R[2:] for L, R in splits if len(R)>1]
    replaces   = [L + c + R[1:]           for L, R in splits if R for c in letters]
    inserts    = [L + c + R               for L, R in splits for c in letters]
    return set(deletes + transposes + replaces + inserts)

def main():
    engTrie = Trie() # Main Trie
    globalDict = PhraseDictionary() # Main (User) Dictionary

    # Parsing tsv input and adding words to Trie & Global Dict
    inputFile = open("input.tsv", "r")
    for line in inputFile:
        l = line.split("\t")
        cID = l[0]
        phrase = l[1].lower()
        globalDict.insertPhraseNode(cID, PhraseNode(phrase))
        engTrie.insertPhrase(cID, phrase)

    while True:
        word = input("Please enter a word or quit() to exit: ")
        if word != 'quit()':
            concepts = engTrie.suggConcepts(word.lower())
            for c in concepts:
                print(globalDict.getPhraseNode(c[0]).getPhrase())
        else:
            break

    inputFile.close()

    # engTrie = Trie()
    # engTrie.insert("hat")
    # engTrie.insert("hello")
    # engTrie.insert("help")
    # engTrie.insert("helper")
    # engTrie.insert("hey")
    # engTrie.insert("hell")
    # engTrie.insert("helm")
    # engTrie.insert("helmet")

    # for phrase in engDict:
    #     words = phrase.lower().split()
    #     if len(words) == 1:
    #         engTrie.insert(words[0])
    #     else:
    #         for word in words:
    #             engTrie.insert(word)

    # while True:
    # 	word = input("Please enter a word or quit() to exit: ");
    # 	if word != 'quit()':
    #         print(engTrie.wordSuggestions(word.lower()))
    #             # edits = edits1(word)
    #             # print(edits)
    #             # corr = False
    #             # for e in edits:
    #             #     if engTrie.search(e):
    #             #         print("\nDid you mean \"" + e + "\"?\n")
    #             #         corr = True
    #             #         break
    #             # if not corr:
    #             #     print("\nWord not found.\n")
    # 	else:
    # 		break

main()

"""
Assume for confidences/likelihoods of certain concepts the ranking of which could change over time.
Ranking/likelihood based on number of times picked before.
Likelihood Score and User Score.

Words and Concepts.
Trie is on the words for autocorrection and autocompletion. Exact match is ranked number 1. Any completions (extensions) come after.
All suggestions based on one edit distance (going to the parent) come after.

Word suggestions are based on concepts, which is the layer on top of the trie.

Potential Optimizations:
For (heh) awesome fuzzy/partial string matching algorithms, check out Damn Cool Algorithms:

http://blog.notdot.net/2007/4/Damn-Cool-Algorithms-Part-1-BK-Trees
http://blog.notdot.net/2010/07/Damn-Cool-Algorithms-Levenshtein-Automata
These don't replace tries, but rather prevent brute-force lookups in tries - which is still a huge win. Next, you probably want a way to bound the size of the trie:

keep a trie of recent/top N words used globally;
for each user, keep a trie of recent/top N words for that user.
Finally, you want to prevent lookups whenever possible...

cache lookup results: if the user clicks through on any search results, you can serve those very quickly and then asynchronously fetch the full partial/fuzzy lookup.
precompute lookup results: if the user has typed "appl", they are likely to continue with "apple", "apply".
prefetch data: for instance, a web app can send a smaller set of results to the browser, small enough to make brute-force searching in JS viable.

"""

"""
### POSSIBLE EVALUATION TECHNIQUES/QUESTIONS ###

1. How many strokes does it take to get to a particular answer/word suggestion?
2. If I have a particular question the top 1-3 suggestions how am I able to get to with X number of clicks?
3. X would be the number to highlight the efficiency of the querying process.
4. How to measure for input words that are not in the system or for those with spelling errors? 
5. Manually introduce random spelling errors and see how many strokes it takes to get to the correct choice.
6. Separate code system for measuring the efficiency of the algorithm
7. Group evaluation: People putting in words that they couldn't find.

"""
