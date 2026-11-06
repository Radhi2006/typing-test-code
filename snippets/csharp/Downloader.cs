// @codetype hard | Download pages concurrently with async and await
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

public static class Downloader
{
    private static readonly HttpClient Http = new()
    {
        Timeout = TimeSpan.FromSeconds(10),
    };

    public static async Task<Dictionary<string, int>> GetSizesAsync(
        IEnumerable<string> urls)
    {
        var tasks = urls.Select(async url =>
        {
            try
            {
                var body = await Http.GetStringAsync(url);
                return (url, size: body.Length);
            }
            catch (HttpRequestException)
            {
                return (url, size: -1);
            }
        });

        var results = await Task.WhenAll(tasks);
        return results.ToDictionary(r => r.url, r => r.size);
    }
}
