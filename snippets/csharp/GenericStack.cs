// @codetype medium | Generic stack with TryPop pattern
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

public class GenericStack<T>
{
    private readonly List<T> _items = new();

    public int Count => _items.Count;

    public void Push(T item) => _items.Add(item);

    public bool TryPop([MaybeNullWhen(false)] out T item)
    {
        if (_items.Count == 0)
        {
            item = default;
            return false;
        }
        item = _items[^1];
        _items.RemoveAt(_items.Count - 1);
        return true;
    }
}
