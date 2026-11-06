// @codetype medium | Count word frequencies from standard input
#include <cctype>
#include <iostream>
#include <map>
#include <string>

int main() {
    std::map<std::string, int> counts;
    std::string word;

    while (std::cin >> word) {
        std::string clean;
        for (char c : word) {
            if (std::isalpha(static_cast<unsigned char>(c))) {
                clean += static_cast<char>(std::tolower(c));
            }
        }
        if (!clean.empty()) ++counts[clean];
    }

    for (const auto& [w, n] : counts) {
        std::cout << w << ": " << n << '\n';
    }
}
