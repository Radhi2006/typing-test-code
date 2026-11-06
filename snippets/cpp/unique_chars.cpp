// @codetype easy | Check whether all characters are unique
#include <iostream>
#include <string>
#include <unordered_set>

bool allUnique(const std::string& s) {
    std::unordered_set<char> seen;
    for (char c : s) {
        if (!seen.insert(c).second) return false;
    }
    return true;
}

int main() {
    std::cout << std::boolalpha << allUnique("code") << ' ' << allUnique("type") << '\n';
}
