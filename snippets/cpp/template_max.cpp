// @codetype easy | Function template that works for any comparable type
#include <iostream>
#include <string>

template <typename T>
const T& maxOf(const T& a, const T& b) {
    return (a < b) ? b : a;
}

int main() {
    std::cout << maxOf(3, 7) << '\n';
    std::cout << maxOf(2.5, 1.5) << '\n';
    std::cout << maxOf(std::string("pear"), std::string("apple")) << '\n';
}
