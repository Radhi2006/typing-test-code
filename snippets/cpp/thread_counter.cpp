// @codetype medium | Increment a shared counter from several threads
#include <iostream>
#include <mutex>
#include <thread>
#include <vector>

int main() {
    int counter = 0;
    std::mutex m;
    std::vector<std::thread> workers;

    for (int i = 0; i < 4; ++i) {
        workers.emplace_back([&] {
            for (int j = 0; j < 10000; ++j) {
                std::lock_guard<std::mutex> lock(m);
                ++counter;
            }
        });
    }
    for (auto& t : workers) t.join();
    std::cout << "counter = " << counter << '\n';
}
