// @codetype hard | LRU cache with a list and an unordered_map
#include <list>
#include <optional>
#include <unordered_map>
#include <utility>

template <typename K, typename V>
class LruCache {
public:
    explicit LruCache(size_t capacity) : capacity_(capacity) {}

    std::optional<V> get(const K& key) {
        auto it = index_.find(key);
        if (it == index_.end()) return std::nullopt;
        items_.splice(items_.begin(), items_, it->second);
        return it->second->second;
    }

    void put(const K& key, V value) {
        if (auto it = index_.find(key); it != index_.end()) {
            items_.erase(it->second);
        }
        items_.emplace_front(key, std::move(value));
        index_[key] = items_.begin();
        if (items_.size() > capacity_) {
            index_.erase(items_.back().first);
            items_.pop_back();
        }
    }

private:
    size_t capacity_;
    std::list<std::pair<K, V>> items_;
    std::unordered_map<K, typename std::list<std::pair<K, V>>::iterator> index_;
};
