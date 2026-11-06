// @codetype easy | Lazy Fibonacci sequence with yield return
using System.Collections.Generic;

public static class FibonacciSequence
{
    public static IEnumerable<long> Generate()
    {
        long a = 0, b = 1;
        while (true)
        {
            yield return a;
            (a, b) = (b, a + b);
        }
    }
}
