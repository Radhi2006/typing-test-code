// @codetype hard | LRU cache with Dictionary and LinkedList
using System.Collections.Generic;

public class LruCache<TKey, TValue> where TKey : notnull
{
    private readonly int _capacity;
    private readonly LinkedList<(TKey Key, TValue Value)> _order = new();
    private readonly Dictionary<TKey, LinkedListNode<(TKey Key, TValue Value)>> _map =
        new();

    public LruCache(int capacity) => _capacity = capacity;

    public bool TryGet(TKey key, out TValue? value)
    {
        if (_map.TryGetValue(key, out var node))
        {
            _order.Remove(node);
            _order.AddFirst(node);
            value = node.Value.Value;
            return true;
        }
        value = default;
        return false;
    }

    public void Put(TKey key, TValue value)
    {
        if (_map.Remove(key, out var existing)) _order.Remove(existing);
        _map[key] = _order.AddFirst((key, value));
        if (_map.Count > _capacity)
        {
            _map.Remove(_order.Last!.Value.Key);
            _order.RemoveLast();
        }
    }
}
