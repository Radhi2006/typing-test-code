// @codetype easy | Split a string by a delimiter into a vector
#include <sstream>
#include <string>
#include <vector>

std::vector<std::string> split(const std::string& text, char delim) {
    std::vector<std::string> parts;
    std::stringstream ss(text);
    std::string item;
    while (std::getline(ss, item, delim)) {
        parts.push_back(item);
    }
    return parts;
}
