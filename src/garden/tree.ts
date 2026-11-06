import { splitLines } from '../engine/layout';
import type { Species } from './species';

/**
 * Turns a code snippet into a tree. The shape comes from the code's indentation:
 * a block is a limb, each statement in it is one stretch of that limb, and a
 * nested block forks off the statement that opens it.
 *
 * Geometry is computed once for the whole snippet. Growing the tree is only a
 * reveal: every part knows the character range that brings it out.
 */

export interface Segment {
  parent: number;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  /** curve control point, so limbs leave their parent smoothly */
  cx: number;
  cy: number;
  w0: number;
  w1: number;
  /** reveal range in character positions; `charEnd` is always above `charStart` */
  charStart: number;
  charEnd: number;
  isTwig: boolean;
}

export interface Leaf {
  x: number;
  y: number;
  rot: number;
  size: number;
  /** character position at which the leaf opens; negative for the first sprout */
  charAt: number;
  /** character whose syntax color the leaf takes */
  colorChar: number;
  /** 0–1, stable per leaf */
  rand: number;
}

export interface Tree {
  segments: Segment[];
  leaves: Leaf[];
  /** main (non-twig) segment for each character position, length code.length + 1 */
  charSeg: Int16Array;
  minX: number;
  maxX: number;
  /** tree units above the root, so always negative */
  minY: number;
  length: number;
}

interface Stmt {
  start: number;
  end: number;
  len: number;
  closer: boolean;
  kids: Stmt[];
}

export function hashSeed(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** a line with nothing to read on it, such as `}` or `);` */
function isCloser(text: string): boolean {
  return !/[A-Za-z0-9_]/.test(text);
}

function parseBlocks(code: string): Stmt[] {
  const root: Stmt[] = [];
  const stack: { indent: number; stmt: Stmt }[] = [];
  for (const line of splitLines(code)) {
    const trimmed = line.text.trimStart();
    if (!trimmed) continue;
    const indent = line.text.length - trimmed.length;
    const start = line.start + indent;
    const stmt: Stmt = {
      start,
      end: line.start + line.text.length,
      len: trimmed.length,
      closer: isCloser(trimmed),
      kids: [],
    };
    // a lone `{` must not take over from the line it belongs to, or the block
    // under it would hang off a bracket instead of the statement that opened it
    const pops = (top: number) => (stmt.closer ? top > indent : top >= indent);
    while (stack.length && pops(stack[stack.length - 1].indent)) stack.pop();
    const siblings = stack.length ? stack[stack.length - 1].stmt.kids : root;
    if (stmt.closer && stack.length && stack[stack.length - 1].indent === indent) {
      stack[stack.length - 1].stmt.kids.push(stmt);
    } else {
      siblings.push(stmt);
    }
    if (!stmt.closer) stack.push({ indent, stmt });
  }
  return root;
}

/** nothing hangs lower than this above the root, so branches never enter the hill */
const GROUND_CLEARANCE = -14;
const TRUNK_HEIGHT = 300;
const LIMB_LENGTH = 165;

export function buildTree(code: string, species: Species, seed: number): Tree {
  const rand = rng(seed);
  const segments: Segment[] = [];
  const leaves: Leaf[] = [];
  const charSeg = new Int16Array(code.length + 1).fill(-1);

  const nonSpaceChar = (from: number, to: number) => {
    const span = Math.max(1, to - from);
    for (let tries = 0; tries < 6; tries++) {
      const i = from + Math.floor(rand() * span);
      if (code[i] && code[i].trim()) return i;
    }
    return from;
  };

  const addLeaf = (x: number, y: number, dir: number, stmt: Stmt, charAt: number) => {
    leaves.push({
      x,
      y,
      rot: dir + (rand() - 0.5) * 1.1,
      size: species.leafSize * (0.8 + rand() * 0.5),
      charAt,
      colorChar: nonSpaceChar(stmt.start, stmt.end),
      rand: rand(),
    });
  };

  const addSeg = (
    parent: number,
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    charStart: number,
    charEnd: number,
    isTwig: boolean,
  ) => {
    const length = Math.hypot(x1 - x0, y1 - y0);
    let dirX = (x1 - x0) / (length || 1);
    let dirY = (y1 - y0) / (length || 1);
    if (parent >= 0) {
      const p = segments[parent];
      const atTip = x0 === p.x1 && y0 === p.y1;
      const fromX = atTip ? p.cx : p.x0;
      const fromY = atTip ? p.cy : p.y0;
      const n = Math.hypot(p.x1 - fromX, p.y1 - fromY) || 1;
      dirX = (p.x1 - fromX) / n;
      dirY = (p.y1 - fromY) / n;
    }
    segments.push({
      parent,
      x0,
      y0,
      x1,
      y1,
      cx: x0 + dirX * length * 0.42,
      cy: y0 + dirY * length * 0.42,
      w0: 0,
      w1: 0,
      charStart,
      charEnd: Math.max(charStart + 1, charEnd),
      isTwig,
    });
    return segments.length - 1;
  };

  const addTwig = (
    parent: number,
    x: number,
    y: number,
    angle: number,
    length: number,
    stmt: Stmt,
    from: number,
    leafCount: number,
  ) => {
    const x1 = x + Math.sin(angle) * length;
    const y1 = Math.min(GROUND_CLEARANCE, y - Math.cos(angle) * length);
    addSeg(parent, x, y, x1, y1, from, stmt.end, true);
    const span = stmt.end - from;
    for (let i = 0; i < leafCount; i++) {
      const t = 1 - (i / leafCount) * 0.85;
      addLeaf(
        x + (x1 - x) * t,
        y + (y1 - y) * t,
        angle + (i % 2 ? 0.7 : -0.7),
        stmt,
        Math.round(from + span * (0.55 + 0.45 * (i / Math.max(1, leafCount)))),
      );
    }
  };

  // a statement that opens a big block gets more length, so forks do not all sit at the root
  const weight = (s: Stmt) => 5 + Math.pow(Math.min(s.len, 60), 0.7) + Math.min(36, s.kids.length * 3);

  /** lays out one block as a chain of segments, forking at nested blocks */
  const layBlock = (
    block: Stmt[],
    startX: number,
    startY: number,
    startAngle: number,
    budget: number,
    level: number,
    side: number,
    parentSeg: number,
  ) => {
    const chain = block.filter((s) => !s.closer);
    const closers = block.filter((s) => s.closer);
    if (chain.length === 0) return;
    const lastHasKids = chain[chain.length - 1].kids.some((k) => !k.closer);
    // a block that ends by opening another keeps going in the same direction
    const ownShare = lastHasKids ? 0.5 : 1;
    const total = chain.reduce((a, s) => a + weight(s), 0);
    let x = startX;
    let y = startY;
    let angle = startAngle;
    let parent = parentSeg;
    let forkSide = side || (rand() < 0.5 ? -1 : 1);

    chain.forEach((stmt, i) => {
      const step = (budget * ownShare * weight(stmt)) / total;
      const goal = species.rise >= 0 ? 0 : (side || forkSide) * 1.75;
      const pull = Math.abs(species.rise) * (level === 0 ? 1.4 : 1);
      angle += (goal - angle) * pull + (rand() - 0.5) * species.kink;
      if (level === 0) angle = Math.max(-0.3, Math.min(0.3, angle));

      const x1 = x + Math.sin(angle) * step;
      const y1 = Math.min(GROUND_CLEARANCE, y - Math.cos(angle) * step);
      // the very first stretch starts early so a sprout is visible before any typing
      const from = segments.length === 0 ? stmt.start - 8 : stmt.start;
      const seg = addSeg(parent, x, y, x1, y1, from, stmt.end, false);
      for (let c = stmt.start; c <= stmt.end + 1 && c < charSeg.length; c++) charSeg[c] = seg;

      const twigs = stmt.len > 26 ? 2 : stmt.len > 6 || level === 0 ? 1 : 0;
      const hanging = species.rise < 0;
      // twigs on the trunk do the work of limbs in flat code, longest near the bottom
      const crown = level === 0 ? 2.5 - 1.3 * (i / Math.max(1, chain.length - 1)) : 1;
      for (let t = 0; t < twigs; t++) {
        const f = 0.4 + 0.5 * ((t + rand() * 0.6) / Math.max(1, twigs));
        const twigSide = (t + i) % 2 ? 1 : -1;
        const twigLength =
          (16 + Math.min(stmt.len, 60) * 0.5) * (0.8 + rand() * 0.4) * species.reach * crown;
        addTwig(
          seg,
          x + (x1 - x) * f,
          y + (y1 - y) * f,
          hanging
            ? twigSide * (2.55 + rand() * 0.4)
            : angle + twigSide * (species.spread * 0.9 + rand() * 0.3),
          hanging ? twigLength * 2 : twigLength,
          stmt,
          stmt.start + Math.floor(stmt.len * 0.35),
          Math.max(3, Math.round((stmt.len / 14 + 2) * species.density)) + (hanging ? 3 : 0),
        );
      }
      const stemLeaves = Math.round((stmt.len / 16) * species.density);
      for (let n = 0; n < stemLeaves; n++) {
        const f = rand();
        addLeaf(
          x + (x1 - x) * f,
          y + (y1 - y) * f,
          angle + (n % 2 ? 1.1 : -1.1),
          stmt,
          stmt.start + Math.floor(stmt.len * (0.3 + f * 0.7)),
        );
      }

      const kids = stmt.kids.filter((k) => !k.closer);
      if (kids.length) {
        const isLast = i === chain.length - 1;
        const childBudget = isLast
          ? budget * 0.56
          : LIMB_LENGTH *
            species.reach *
            Math.pow(0.84, level) *
            (0.55 + 0.45 * Math.min(1, kids.length / 7));
        if (isLast) {
          layBlock(stmt.kids, x1, y1, angle + forkSide * 0.16, childBudget, level, side, seg);
        } else {
          layBlock(
            stmt.kids,
            x1,
            y1,
            angle + forkSide * species.spread,
            childBudget,
            level + 1,
            forkSide,
            seg,
          );
          forkSide = -forkSide;
        }
      }

      x = x1;
      y = y1;
      parent = seg;
    });

    const last = chain[chain.length - 1];
    if (!lastHasKids) {
      // limbs end in a small fork
      for (let t = 0; t < 3; t++) {
        const fanned = angle + (t - 1) * species.spread * 0.75;
        addTwig(
          parent,
          x,
          y,
          species.rise < 0 ? Math.sign(fanned || 1) * (2.4 + t * 0.2) : fanned,
          (26 + rand() * 20) * species.reach * (species.rise < 0 ? 1.8 : 1),
          last,
          last.start + Math.floor(last.len * 0.5),
          Math.max(4, Math.round(3 * species.density)),
        );
      }
    }
    // closing brackets are the buds at the end of a limb
    for (const closer of closers) {
      addLeaf(x, y, angle + (rand() - 0.5) * 2.4, closer, closer.end);
    }
  };

  // short snippets get a shorter trunk, which reads as a bushy young tree after scaling
  const lineCount = code.split('\n').filter((l) => l.trim()).length;
  const trunk = TRUNK_HEIGHT * species.height * (0.55 + 0.45 * Math.min(1, lineCount / 14));
  layBlock(parseBlocks(code), 0, 0, 0, trunk, 0, 0, -1);

  if (segments.length === 0) addSeg(-1, 0, 0, 0, -40, -8, Math.max(1, code.length), false);

  // two seed leaves on the sprout that stands before anything is typed
  const root = segments[0];
  const sproutAt = 8 / Math.max(9, root.charEnd - root.charStart);
  for (const side of [-1, 1]) {
    leaves.push({
      x: root.x0 + (root.x1 - root.x0) * sproutAt,
      y: root.y0 + (root.y1 - root.y0) * sproutAt,
      rot: side * 0.85,
      size: 15,
      charAt: -1,
      colorChar: 0,
      rand: 0.5,
    });
  }

  // characters between statements (indentation, blank lines) belong to the previous stretch
  let last = 0;
  for (let c = 0; c < charSeg.length; c++) {
    if (charSeg[c] === -1) charSeg[c] = last;
    else last = charSeg[c];
  }

  // thickness follows how much tree each segment carries
  const load = segments.map((s) => Math.hypot(s.x1 - s.x0, s.y1 - s.y0));
  for (let i = segments.length - 1; i >= 0; i--) {
    const p = segments[i].parent;
    if (p >= 0) load[p] += load[i];
  }
  const widthFor = (l: number) => (1.5 + 0.3 * Math.sqrt(l)) * species.girth;
  const heaviestChild = new Float64Array(segments.length);
  segments.forEach((s, i) => {
    if (s.parent >= 0) heaviestChild[s.parent] = Math.max(heaviestChild[s.parent], load[i]);
  });
  segments.forEach((s, i) => {
    s.w0 = widthFor(load[i]);
    s.w1 = heaviestChild[i] > 0 ? widthFor(heaviestChild[i]) : Math.max(0.6, s.w0 * 0.35);
  });

  let minX = 0;
  let maxX = 0;
  let minY = 0;
  for (const s of segments) {
    minX = Math.min(minX, s.x0, s.x1);
    maxX = Math.max(maxX, s.x0, s.x1);
    minY = Math.min(minY, s.y0, s.y1);
  }
  for (const l of leaves) {
    minX = Math.min(minX, l.x - l.size);
    maxX = Math.max(maxX, l.x + l.size);
    minY = Math.min(minY, l.y - l.size);
  }

  return { segments, leaves, charSeg, minX, maxX, minY, length: code.length };
}
