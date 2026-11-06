import type { Snippet } from '../snippets/types';
import { LANG_BY_ID } from '../snippets/languages';
import { SPECIES } from './species';
import { buildTree, hashSeed, type Tree } from './tree';

export function treeFor(snippet: Snippet): Tree {
  return buildTree(snippet.code, SPECIES[snippet.lang], hashSeed(snippet.id));
}

export function speciesLabel(snippet: Snippet): string {
  return `${SPECIES[snippet.lang].name}, grown from ${LANG_BY_ID[snippet.lang].name}`;
}
