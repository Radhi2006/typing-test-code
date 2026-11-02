import { CodeSnippet } from '../../types/snippet';

const snippets: CodeSnippet[] = [
  // ===== EASY (9) =====
  {
    id: 'js-001',
    language: 'javascript',
    title: 'Fibonacci',
    description: 'Recursive fibonacci function',
    code: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`,
    difficulty: 'easy',
    tags: ['recursion', 'math'],
  },
  {
    id: 'js-002',
    language: 'javascript',
    title: 'Factorial',
    description: 'Calculate factorial of a number',
    code: `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}`,
    difficulty: 'easy',
    tags: ['recursion', 'math'],
  },
  {
    id: 'js-003',
    language: 'javascript',
    title: 'Reverse String',
    description: 'Reverse a string using split and join',
    code: `function reverseString(str) {
  return str.split('').reverse().join('');
}`,
    difficulty: 'easy',
    tags: ['string', 'utility'],
  },
  {
    id: 'js-004',
    language: 'javascript',
    title: 'Is Palindrome',
    description: 'Check if a string is a palindrome',
    code: `function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}`,
    difficulty: 'easy',
    tags: ['string', 'validation'],
  },
  {
    id: 'js-005',
    language: 'javascript',
    title: 'Find Max',
    description: 'Find the maximum value in an array',
    code: `function findMax(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
  }
  return max;
}`,
    difficulty: 'easy',
    tags: ['array', 'search'],
  },
  {
    id: 'js-006',
    language: 'javascript',
    title: 'Flatten Array',
    description: 'Recursively flatten a nested array',
    code: `function flatten(arr) {
  return arr.reduce((acc, val) => {
    return acc.concat(Array.isArray(val) ? flatten(val) : val);
  }, []);
}`,
    difficulty: 'easy',
    tags: ['array', 'recursion'],
  },
  {
    id: 'js-007',
    language: 'javascript',
    title: 'Capitalize Words',
    description: 'Capitalize the first letter of each word',
    code: `function capitalize(str) {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}`,
    difficulty: 'easy',
    tags: ['string', 'utility'],
  },
  {
    id: 'js-008',
    language: 'javascript',
    title: 'Count Vowels',
    description: 'Count the number of vowels in a string',
    code: `function countVowels(str) {
  const matches = str.match(/[aeiou]/gi);
  return matches ? matches.length : 0;
}`,
    difficulty: 'easy',
    tags: ['string', 'regex'],
  },
  {
    id: 'js-009',
    language: 'javascript',
    title: 'Sum Array',
    description: 'Sum all numbers in an array using reduce',
    code: `function sumArray(arr) {
  return arr.reduce((sum, num) => sum + num, 0);
}`,
    difficulty: 'easy',
    tags: ['array', 'math'],
  },

  // ===== MEDIUM (9) =====
  {
    id: 'js-010',
    language: 'javascript',
    title: 'Debounce',
    description: 'Debounce function to limit execution rate',
    code: `function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}`,
    difficulty: 'medium',
    tags: ['functional', 'performance'],
  },
  {
    id: 'js-011',
    language: 'javascript',
    title: 'Throttle',
    description: 'Throttle function execution to a fixed interval',
    code: `function throttle(fn, limit) {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}`,
    difficulty: 'medium',
    tags: ['functional', 'performance'],
  },
  {
    id: 'js-012',
    language: 'javascript',
    title: 'Deep Clone',
    description: 'Deep clone an object recursively',
    code: `function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(deepClone);
  const clone = {};
  for (const key of Object.keys(obj)) {
    clone[key] = deepClone(obj[key]);
  }
  return clone;
}`,
    difficulty: 'medium',
    tags: ['object', 'recursion'],
  },
  {
    id: 'js-013',
    language: 'javascript',
    title: 'Curry',
    description: 'Curry a function to accept arguments one at a time',
    code: `function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function (...nextArgs) {
      return curried.apply(this, args.concat(nextArgs));
    };
  };
}`,
    difficulty: 'medium',
    tags: ['functional', 'closure'],
  },
  {
    id: 'js-014',
    language: 'javascript',
    title: 'Memoize',
    description: 'Memoize a function to cache results',
    code: `function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}`,
    difficulty: 'medium',
    tags: ['functional', 'performance'],
  },
  {
    id: 'js-015',
    language: 'javascript',
    title: 'Event Emitter',
    description: 'Simple event emitter with on, off, and emit',
    code: `class EventEmitter {
  constructor() {
    this.events = {};
  }
  on(event, listener) {
    (this.events[event] || (this.events[event] = [])).push(listener);
  }
  off(event, listener) {
    this.events[event] = (this.events[event] || []).filter(l => l !== listener);
  }
  emit(event, ...args) {
    (this.events[event] || []).forEach(l => l(...args));
  }
}`,
    difficulty: 'medium',
    tags: ['class', 'events'],
  },
  {
    id: 'js-016',
    language: 'javascript',
    title: 'Promise All',
    description: 'Custom implementation of Promise.all',
    code: `function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;
    promises.forEach((p, i) => {
      Promise.resolve(p).then(value => {
        results[i] = value;
        if (++completed === promises.length) resolve(results);
      }).catch(reject);
    });
  });
}`,
    difficulty: 'medium',
    tags: ['promise', 'async'],
  },
  {
    id: 'js-017',
    language: 'javascript',
    title: 'Binary Search',
    description: 'Iterative binary search on a sorted array',
    code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
    difficulty: 'medium',
    tags: ['algorithm', 'search'],
  },
  {
    id: 'js-018',
    language: 'javascript',
    title: 'Linked List Operations',
    description: 'Linked list with append and toArray methods',
    code: `class LinkedList {
  constructor() {
    this.head = null;
  }
  append(value) {
    const node = { value, next: null };
    if (!this.head) { this.head = node; return; }
    let current = this.head;
    while (current.next) current = current.next;
    current.next = node;
  }
  toArray() {
    const arr = [];
    let current = this.head;
    while (current) { arr.push(current.value); current = current.next; }
    return arr;
  }
}`,
    difficulty: 'medium',
    tags: ['data-structure', 'class'],
  },

  // ===== HARD (7) =====
  {
    id: 'js-019',
    language: 'javascript',
    title: 'Merge Sort',
    description: 'Recursive merge sort algorithm',
    code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    result.push(left[i] < right[j] ? left[i++] : right[j++]);
  }
  return result.concat(left.slice(i), right.slice(j));
}`,
    difficulty: 'hard',
    tags: ['algorithm', 'sorting', 'recursion'],
  },
  {
    id: 'js-020',
    language: 'javascript',
    title: 'Async Queue',
    description: 'Async task queue with concurrency limit',
    code: `class AsyncQueue {
  constructor(concurrency) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }
  enqueue(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.run();
    });
  }
  run() {
    while (this.running < this.concurrency && this.queue.length) {
      const { task, resolve, reject } = this.queue.shift();
      this.running++;
      task().then(resolve, reject).finally(() => { this.running--; this.run(); });
    }
  }
}`,
    difficulty: 'hard',
    tags: ['async', 'concurrency', 'class'],
  },
  {
    id: 'js-021',
    language: 'javascript',
    title: 'Observable Pattern',
    description: 'Simple observable with subscribe and pipe',
    code: `class Observable {
  constructor(subscribeFn) {
    this._subscribe = subscribeFn;
  }
  subscribe(observer) {
    return this._subscribe(observer);
  }
  pipe(...operators) {
    return operators.reduce((obs, op) => op(obs), this);
  }
  static from(iterable) {
    return new Observable(observer => {
      for (const value of iterable) observer.next(value);
      observer.complete();
    });
  }
}`,
    difficulty: 'hard',
    tags: ['pattern', 'reactive'],
  },
  {
    id: 'js-022',
    language: 'javascript',
    title: 'Virtual DOM Diff',
    description: 'Simple virtual DOM diffing algorithm',
    code: `function diff(oldNode, newNode) {
  if (!oldNode) return { type: 'CREATE', newNode };
  if (!newNode) return { type: 'REMOVE' };
  if (typeof oldNode !== typeof newNode ||
      (typeof oldNode === 'string' && oldNode !== newNode) ||
      oldNode.tag !== newNode.tag) {
    return { type: 'REPLACE', newNode };
  }
  if (newNode.tag) {
    const propsDiff = diffProps(oldNode.props, newNode.props);
    const childDiffs = diffChildren(oldNode.children, newNode.children);
    return { type: 'UPDATE', props: propsDiff, children: childDiffs };
  }
  return null;
}`,
    difficulty: 'hard',
    tags: ['dom', 'algorithm'],
  },
  {
    id: 'js-023',
    language: 'javascript',
    title: 'Promise Pool',
    description: 'Execute promises with concurrency pool limit',
    code: `async function promisePool(tasks, poolLimit) {
  const results = [];
  const executing = new Set();
  for (const [index, task] of tasks.entries()) {
    const p = Promise.resolve().then(() => task());
    results[index] = p;
    executing.add(p);
    const cleanup = () => executing.delete(p);
    p.then(cleanup, cleanup);
    if (executing.size >= poolLimit) {
      await Promise.race(executing);
    }
  }
  return Promise.all(results);
}`,
    difficulty: 'hard',
    tags: ['async', 'concurrency'],
  },
  {
    id: 'js-024',
    language: 'javascript',
    title: 'Middleware Chain',
    description: 'Express-style middleware chain runner',
    code: `function compose(middlewares) {
  return function (context) {
    let index = -1;
    function dispatch(i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'));
      index = i;
      const fn = middlewares[i];
      if (!fn) return Promise.resolve();
      try {
        return Promise.resolve(fn(context, () => dispatch(i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return dispatch(0);
  };
}`,
    difficulty: 'hard',
    tags: ['pattern', 'async'],
  },
  {
    id: 'js-025',
    language: 'javascript',
    title: 'State Machine',
    description: 'Finite state machine with transitions',
    code: `class StateMachine {
  constructor(config) {
    this.state = config.initial;
    this.transitions = config.transitions;
    this.handlers = config.handlers || {};
  }
  transition(event) {
    const key = \`\${this.state}.\${event}\`;\n    const next = this.transitions[key];\n    if (!next) throw new Error(\`Invalid transition: \${key}\`);\n    const handler = this.handlers[key];\n    if (handler) handler(this.state, next);\n    this.state = next;\n    return this.state;\n  }\n  is(state) {\n    return this.state === state;\n  }\n}`,
    difficulty: 'hard',
    tags: ['pattern', 'class'],
  },
];

export default snippets;
