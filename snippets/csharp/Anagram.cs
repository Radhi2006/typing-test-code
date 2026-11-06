// @codetype easy | Check whether two words are anagrams
using System;
using System.Linq;

public static class Anagram
{
    public static bool AreAnagrams(string a, string b)
    {
        static string Normalize(string s) =>
            new(s.ToLowerInvariant().Where(char.IsLetter).OrderBy(c => c).ToArray());

        return Normalize(a) == Normalize(b);
    }

    public static void Main() => Console.WriteLine(AreAnagrams("Listen", "Silent"));
}
