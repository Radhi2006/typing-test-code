// @codetype hard | Generic repository interface with an in-memory store
using System;
using System.Collections.Generic;
using System.Linq;

public interface IEntity
{
    Guid Id { get; }
}

public interface IRepository<T> where T : IEntity
{
    T? Find(Guid id);
    IReadOnlyList<T> Where(Func<T, bool> predicate);
    void Save(T entity);
    bool Delete(Guid id);
}

public class InMemoryRepository<T> : IRepository<T> where T : IEntity
{
    private readonly Dictionary<Guid, T> _items = new();

    public T? Find(Guid id) => _items.TryGetValue(id, out var item) ? item : default;

    public IReadOnlyList<T> Where(Func<T, bool> predicate) =>
        _items.Values.Where(predicate).ToList();

    public void Save(T entity) => _items[entity.Id] = entity;

    public bool Delete(Guid id) => _items.Remove(id);
}
