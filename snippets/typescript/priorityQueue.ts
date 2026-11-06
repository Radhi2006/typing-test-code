// @codetype hard | Binary min-heap priority queue
export class PriorityQueue<T> {
  private heap: { item: T; priority: number }[] = [];

  get size(): number {
    return this.heap.length;
  }

  push(item: T, priority: number): void {
    this.heap.push({ item, priority });
    let i = this.heap.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.heap[parent].priority <= this.heap[i].priority) break;
      [this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]];
      i = parent;
    }
  }

  pop(): T | undefined {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.sinkDown(0);
    }
    return top.item;
  }

  private sinkDown(i: number): void {
    const n = this.heap.length;
    while (true) {
      const l = 2 * i + 1;
      const r = l + 1;
      let min = i;
      if (l < n && this.heap[l].priority < this.heap[min].priority) min = l;
      if (r < n && this.heap[r].priority < this.heap[min].priority) min = r;
      if (min === i) return;
      [this.heap[min], this.heap[i]] = [this.heap[i], this.heap[min]];
      i = min;
    }
  }
}
