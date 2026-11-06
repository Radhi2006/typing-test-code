// @codetype medium | Return an optional result instead of a sentinel
#include <iostream>
#include <optional>
#include <string>
#include <vector>

struct User {
    int id;
    std::string name;
};

std::optional<User> findUser(const std::vector<User>& users, int id) {
    for (const auto& u : users) {
        if (u.id == id) return u;
    }
    return std::nullopt;
}

int main() {
    std::vector<User> users{{1, "Ada"}, {2, "Grace"}};
    if (auto user = findUser(users, 2)) {
        std::cout << "Found " << user->name << '\n';
    } else {
        std::cout << "Not found\n";
    }
}
