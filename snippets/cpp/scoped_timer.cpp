// @codetype medium | RAII timer that reports when it goes out of scope
#include <chrono>
#include <iostream>
#include <string>
#include <utility>

class ScopedTimer {
public:
    explicit ScopedTimer(std::string label)
        : label_(std::move(label)), start_(std::chrono::steady_clock::now()) {}

    ~ScopedTimer() {
        auto end = std::chrono::steady_clock::now();
        auto ms = std::chrono::duration_cast<std::chrono::milliseconds>(end - start_);
        std::cout << label_ << " took " << ms.count() << " ms\n";
    }

private:
    std::string label_;
    std::chrono::steady_clock::time_point start_;
};
