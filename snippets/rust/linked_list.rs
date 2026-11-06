// @codetype hard | Singly linked list with Option<Box<Node>>
struct Node {
    value: i32,
    next: Option<Box<Node>>,
}

pub struct List {
    head: Option<Box<Node>>,
}

impl List {
    pub fn new() -> Self {
        List { head: None }
    }

    pub fn push(&mut self, value: i32) {
        let old = self.head.take();
        self.head = Some(Box::new(Node { value, next: old }));
    }

    pub fn pop(&mut self) -> Option<i32> {
        self.head.take().map(|node| {
            self.head = node.next;
            node.value
        })
    }

    pub fn reverse(&mut self) {
        let mut prev = None;
        let mut current = self.head.take();
        while let Some(mut node) = current {
            current = node.next.take();
            node.next = prev;
            prev = Some(node);
        }
        self.head = prev;
    }
}
