// @codetype hard | Trie for fast prefix search and autocomplete
class TrieNode {
  children = new Map<string, TrieNode>();
  isWord = false;
}

export class Trie {
  private root = new TrieNode();

  insert(word: string): void {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch)!;
    }
    node.isWord = true;
  }

  suggest(prefix: string, limit = 5): string[] {
    let node = this.root;
    for (const ch of prefix) {
      const next = node.children.get(ch);
      if (!next) return [];
      node = next;
    }
    const results: string[] = [];
    const walk = (current: TrieNode, path: string) => {
      if (results.length >= limit) return;
      if (current.isWord) results.push(path);
      for (const [ch, child] of current.children) walk(child, path + ch);
    };
    walk(node, prefix);
    return results;
  }
}
