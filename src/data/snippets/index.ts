import { CodeSnippet, Language, Difficulty } from '../../types/snippet';
import javascriptSnippets from './javascript';
import typescriptSnippets from './typescript';
import pythonSnippets from './python';
import javaSnippets from './java';
import cppSnippets from './cpp';
import goSnippets from './go';
import rustSnippets from './rust';
import csharpSnippets from './csharp';
import phpSnippets from './php';
import rubySnippets from './ruby';
import swiftSnippets from './swift';
import kotlinSnippets from './kotlin';
import htmlSnippets from './html';
import cssSnippets from './css';
import sqlSnippets from './sql';

// Combine all snippets into a single collection
const allSnippets: CodeSnippet[] = [
  ...javascriptSnippets,
  ...typescriptSnippets,
  ...pythonSnippets,
  ...javaSnippets,
  ...cppSnippets,
  ...goSnippets,
  ...rustSnippets,
  ...csharpSnippets,
  ...phpSnippets,
  ...rubySnippets,
  ...swiftSnippets,
  ...kotlinSnippets,
  ...htmlSnippets,
  ...cssSnippets,
  ...sqlSnippets,
];

/**
 * Get a random snippet filtered by language(s) and difficulty.
 * If no snippets match the filters, falls back to any snippet from the selected languages,
 * then to any snippet at all.
 */
export function getRandomSnippet(
  languages: Language[],
  difficulty: Difficulty | 'all'
): CodeSnippet {
  let filtered = allSnippets.filter((s) => languages.includes(s.language));

  if (difficulty !== 'all') {
    const byDifficulty = filtered.filter((s) => s.difficulty === difficulty);
    if (byDifficulty.length > 0) {
      filtered = byDifficulty;
    }
  }

  // Fallback: if no snippets match the language filter, use all snippets
  if (filtered.length === 0) {
    filtered = allSnippets;
  }

  const index = Math.floor(Math.random() * filtered.length);
  return filtered[index];
}

/** Get all snippets for a specific language. */
export function getSnippetsByLanguage(language: Language): CodeSnippet[] {
  return allSnippets.filter((s) => s.language === language);
}

/** Get all snippets for a specific difficulty. */
export function getSnippetsByDifficulty(difficulty: Difficulty): CodeSnippet[] {
  return allSnippets.filter((s) => s.difficulty === difficulty);
}

/** Find a single snippet by its unique ID. */
export function getSnippetById(id: string): CodeSnippet | undefined {
  return allSnippets.find((s) => s.id === id);
}

/** Return the full array of all snippets. */
export function getAllSnippets(): CodeSnippet[] {
  return allSnippets;
}

/** Return a count of snippets per language. */
export function getSnippetCount(): Record<Language, number> {
  const counts = {} as Record<Language, number>;
  for (const snippet of allSnippets) {
    counts[snippet.language] = (counts[snippet.language] || 0) + 1;
  }
  return counts;
}
