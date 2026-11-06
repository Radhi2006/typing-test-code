// @codetype easy | Count words with a Dictionary
using System;
using System.Collections.Generic;

public static class WordCounter
{
    public static Dictionary<string, int> Count(string text)
    {
        var counts = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
        var words = text.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        foreach (var word in words)
        {
            counts[word] = counts.TryGetValue(word, out var n) ? n + 1 : 1;
        }
        return counts;
    }
}
