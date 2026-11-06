// @codetype easy | Mean, min and max of a vector with STL algorithms
#include <algorithm>
#include <iostream>
#include <numeric>
#include <vector>

int main() {
    std::vector<double> scores{72.5, 88.0, 91.5, 64.0, 79.5};
    double sum = std::accumulate(scores.begin(), scores.end(), 0.0);
    auto [lo, hi] = std::minmax_element(scores.begin(), scores.end());

    std::cout << "mean: " << sum / scores.size() << '\n'
              << "min:  " << *lo << '\n'
              << "max:  " << *hi << '\n';
}
