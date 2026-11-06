// @codetype medium | Raise events with EventHandler<T>
using System;

public class TemperatureChangedEventArgs : EventArgs
{
    public double Celsius { get; init; }
}

public class TemperatureSensor
{
    public event EventHandler<TemperatureChangedEventArgs>? TemperatureChanged;

    private double _current;

    public void Report(double celsius)
    {
        if (Math.Abs(celsius - _current) < 0.1) return;
        _current = celsius;
        var args = new TemperatureChangedEventArgs { Celsius = celsius };
        TemperatureChanged?.Invoke(this, args);
    }
}
