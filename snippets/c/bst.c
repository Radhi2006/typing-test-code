// @codetype hard | Binary search tree insert and in-order walk
#include <stdio.h>
#include <stdlib.h>

typedef struct Tree {
    int key;
    struct Tree *left, *right;
} Tree;

Tree *insert(Tree *root, int key) {
    if (root == NULL) {
        Tree *node = calloc(1, sizeof(Tree));
        if (node != NULL) node->key = key;
        return node;
    }
    if (key < root->key) root->left = insert(root->left, key);
    else if (key > root->key) root->right = insert(root->right, key);
    return root;
}

void in_order(const Tree *root) {
    if (root == NULL) return;
    in_order(root->left);
    printf("%d ", root->key);
    in_order(root->right);
}

void destroy(Tree *root) {
    if (root == NULL) return;
    destroy(root->left);
    destroy(root->right);
    free(root);
}
