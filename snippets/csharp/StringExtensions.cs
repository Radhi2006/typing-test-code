// @codetype easy | Extension methods for strings
using System.Linq;

public static class StringExtensions
{
    public static string Truncate(this string value, int max) =>
        value.Length <= max ? value : value[..(max - 1)] + "...";

    public static bool IsPalindrome(this string value)
    {
        var clean = new string(value.Where(char.IsLetterOrDigit).ToArray()).ToLower();
        return clean.SequenceEqual(clean.Reverse());
    }
}
