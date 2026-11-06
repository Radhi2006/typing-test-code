// @codetype medium | Ownership of tree nodes with unique_ptr
#include <iostream>
#include <memory>

struct Node {
    int value;
    std::unique_ptr<Node> left;
    std::unique_ptr<Node> right;
    explicit Node(int v) : value(v) {}
};

void insert(std::unique_ptr<Node>& root, int value) {
    if (!root) {
        root = std::make_unique<Node>(value);
    } else if (value < root->value) {
        insert(root->left, value);
    } else {
        insert(root->right, value);
    }
}

void print(const std::unique_ptr<Node>& root) {
    if (!root) return;
    print(root->left);
    std::cout << root->value << ' ';
    print(root->right);
}
