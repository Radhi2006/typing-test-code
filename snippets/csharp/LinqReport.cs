// @codetype medium | Query records with LINQ
using System;
using System.Collections.Generic;
using System.Linq;

public record Sale(string Region, string Product, decimal Amount);

public static class LinqReport
{
    public static void Print(IEnumerable<Sale> sales)
    {
        var byRegion = sales
            .GroupBy(s => s.Region)
            .Select(g => new { Region = g.Key, Total = g.Sum(s => s.Amount) })
            .OrderByDescending(x => x.Total);

        foreach (var row in byRegion)
        {
            Console.WriteLine($"{row.Region,-10} {row.Total,12:N0}");
        }
    }
}
