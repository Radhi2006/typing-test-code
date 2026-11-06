// @codetype medium | Class template stack wrapping std::vector
#include <stdexcept>
#include <vector>

template <typename T>
class Stack {
public:
    void push(const T& item) { data_.push_back(item); }

    T pop() {
        if (data_.empty()) throw std::out_of_range("pop on empty stack");
        T top = data_.back();
        data_.pop_back();
        return top;
    }

    const T& top() const { return data_.back(); }
    bool empty() const { return data_.empty(); }
    std::size_t size() const { return data_.size(); }

private:
    std::vector<T> data_;
};
