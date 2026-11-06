// @codetype easy | Convert temperatures with expression-bodied members
public static class Temperature
{
    public static double ToFahrenheit(double celsius) => celsius * 9 / 5 + 32;

    public static double ToCelsius(double fahrenheit) => (fahrenheit - 32) * 5 / 9;

    public static string Describe(double celsius) => celsius switch
    {
        < 0 => "freezing",
        < 15 => "cold",
        < 25 => "pleasant",
        _ => "hot",
    };
}
