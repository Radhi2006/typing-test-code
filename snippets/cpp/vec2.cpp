// @codetype hard | 2D vector type with operator overloading
#include <cmath>
#include <iostream>

struct Vec2 {
    double x{}, y{};

    Vec2 operator+(const Vec2& o) const { return {x + o.x, y + o.y}; }
    Vec2 operator-(const Vec2& o) const { return {x - o.x, y - o.y}; }
    Vec2 operator*(double s) const { return {x * s, y * s}; }
    Vec2& operator+=(const Vec2& o) {
        x += o.x;
        y += o.y;
        return *this;
    }
    double length() const { return std::hypot(x, y); }
    Vec2 normalized() const {
        double len = length();
        return len == 0 ? Vec2{} : Vec2{x / len, y / len};
    }
};

std::ostream& operator<<(std::ostream& os, const Vec2& v) {
    return os << '(' << v.x << ", " << v.y << ')';
}

int main() {
    Vec2 pos{1, 2}, vel{3, 4};
    pos += vel.normalized() * 2.0;
    std::cout << pos << '\n';
}
