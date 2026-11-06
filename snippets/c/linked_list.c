// @codetype medium | Singly linked list with push, print and free
#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int value;
    struct Node *next;
} Node;

Node *push(Node *head, int value) {
    Node *node = malloc(sizeof(Node));
    if (node == NULL) return head;
    node->value = value;
    node->next = head;
    return node;
}

void print_list(const Node *head) {
    for (const Node *n = head; n != NULL; n = n->next) printf("%d -> ", n->value);
    printf("NULL\n");
}

void free_list(Node *head) {
    while (head != NULL) {
        Node *next = head->next;
        free(head);
        head = next;
    }
}
