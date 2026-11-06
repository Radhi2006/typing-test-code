// @codetype medium | Singly linked list that is iterable
interface ListNode<T> {
  value: T;
  next: ListNode<T> | null;
}

export class LinkedList<T> implements Iterable<T> {
  private head: ListNode<T> | null = null;
  private tail: ListNode<T> | null = null;

  append(value: T): this {
    const node: ListNode<T> = { value, next: null };
    if (this.tail) this.tail.next = node;
    else this.head = node;
    this.tail = node;
    return this;
  }

  *[Symbol.iterator](): Iterator<T> {
    for (let node = this.head; node; node = node.next) {
      yield node.value;
    }
  }
}

const list = new LinkedList<number>().append(1).append(2).append(3);
console.log([...list]); // [1, 2, 3]
