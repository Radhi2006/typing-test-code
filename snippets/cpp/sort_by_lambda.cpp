// @codetype easy | Sort structs with a custom lambda comparator
#include <algorithm>
#include <iostream>
#include <string>
#include <vector>

struct Player {
    std::string name;
    int score;
};

int main() {
    std::vector<Player> players{{"Rina", 420}, {"Dodi", 980}, {"Sari", 760}};
    std::sort(players.begin(), players.end(),
              [](const Player& a, const Player& b) { return a.score > b.score; });

    for (const auto& p : players) std::cout << p.name << ' ' << p.score << '\n';
}
