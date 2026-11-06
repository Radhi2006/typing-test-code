import { isGrey } from './color';
import type { LeafShape } from './species';
import type { Leaf, Segment, Tree } from './tree';
import type { World } from './worlds';

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeOutBack = (t: number) => {
  const c = 1.9;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};

function leafPath(shape: LeafShape): Path2D {
  // unit leaves: the stem sits at the origin and the tip points along -y
  const p = new Path2D();
  switch (shape) {
    case 'round':
      p.moveTo(0, 0);
      p.bezierCurveTo(-0.72, -0.2, -0.62, -1, 0, -1.08);
      p.bezierCurveTo(0.62, -1, 0.72, -0.2, 0, 0);
      break;
    case 'blade':
      p.moveTo(0, 0);
      p.quadraticCurveTo(-0.3, -0.75, 0, -1.5);
      p.quadraticCurveTo(0.3, -0.75, 0, 0);
      break;
    case 'needle':
      p.moveTo(-0.07, 0);
      p.lineTo(0, -1.45);
      p.lineTo(0.07, 0);
      p.moveTo(-0.07, -0.1);
      p.lineTo(-0.5, -1.15);
      p.lineTo(-0.38, -1.2);
      p.closePath();
      p.moveTo(0.07, -0.1);
      p.lineTo(0.5, -1.15);
      p.lineTo(0.38, -1.2);
      p.closePath();
      break;
    case 'petal':
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        const cx = Math.sin(a) * 0.45;
        const cy = -0.5 - Math.cos(a) * 0.45;
        p.moveTo(cx + 0.36, cy);
        p.arc(cx, cy, 0.36, 0, Math.PI * 2);
      }
      break;
    case 'fan':
      p.moveTo(0, 0);
      p.lineTo(-0.82, -0.85);
      p.quadraticCurveTo(-0.35, -1.22, -0.04, -0.98);
      p.lineTo(0, -0.74);
      p.lineTo(0.04, -0.98);
      p.quadraticCurveTo(0.35, -1.22, 0.82, -0.85);
      p.closePath();
      break;
    case 'heart':
      p.moveTo(0, 0);
      p.bezierCurveTo(-0.32, -0.2, -0.84, -0.5, -0.56, -0.96);
      p.bezierCurveTo(-0.34, -1.2, -0.08, -1.1, 0, -0.84);
      p.bezierCurveTo(0.08, -1.1, 0.34, -1.2, 0.56, -0.96);
      p.bezierCurveTo(0.84, -0.5, 0.32, -0.2, 0, 0);
      break;
  }
  return p;
}

const LEAF_PATHS = new Map<LeafShape, Path2D>();

export function leafFor(shape: LeafShape): Path2D {
  let p = LEAF_PATHS.get(shape);
  if (!p) {
    p = leafPath(shape);
    LEAF_PATHS.set(shape, p);
  }
  return p;
}

export interface Painted {
  tree: Tree;
  shape: LeafShape;
  /** leaf drawing order, sorted so equal colors share one fill style */
  order: { leaf: Leaf; fill: string }[];
}

/** Pairs each leaf with its color. `charColors` are per-character syntax colors. */
export function paintLeaves(
  tree: Tree,
  shape: LeafShape,
  charColors: string[] | null,
  fallback: string[],
  sprout: string,
): Painted {
  const order = tree.leaves.map((leaf) => {
    const syntax = charColors?.[leaf.colorChar];
    const seasonal = fallback[Math.floor(leaf.rand * fallback.length) % fallback.length];
    // plain text has no hue worth showing, so those leaves take the world's own colors
    const fill = leaf.charAt < 0 ? sprout : syntax && !isGrey(syntax) ? syntax : seasonal;
    return { leaf, fill };
  });
  order.sort((a, b) => (a.fill < b.fill ? -1 : a.fill > b.fill ? 1 : 0));
  return { tree, shape, order };
}

/** Point on a segment's curve, `u` from 0 to 1. */
export function curvePoint(s: Segment, u: number) {
  const ax = lerp(s.x0, s.cx, u);
  const ay = lerp(s.y0, s.cy, u);
  return { x: lerp(ax, lerp(s.cx, s.x1, u), u), y: lerp(ay, lerp(s.cy, s.y1, u), u) };
}

export interface TreeDraw {
  /** character position the tree has grown to */
  reveal: number;
  time: number;
  /** sway strength in tree units */
  sway: number;
  bark: string;
  rim: string;
  rimAlpha: number;
  /** 0–1, leaves whose `rand` is above this are skipped */
  leafKeep?: number;
}

const swayAt = (x: number, y: number, h: number, time: number, amp: number) => {
  if (amp === 0) return 0;
  const k = -y / h;
  return amp * k * k * Math.sin(time * 1.25 + y * 0.012 + x * 0.006);
};

/** Draws a tree at the current transform, root at the origin. */
export function drawTree(ctx: CanvasRenderingContext2D, p: Painted, d: TreeDraw) {
  const { tree } = p;
  const { reveal, time, sway } = d;
  const h = -tree.minY || 1;
  // a tree thickens as it grows, so the sprout is not as wide as the finished trunk
  const girth = 0.26 + 0.74 * clamp01(reveal / Math.max(1, tree.length));
  const joints = new Path2D();
  const limbs = new Path2D();
  const rims = new Path2D();

  for (const s of tree.segments) {
    const t = clamp01((reveal - s.charStart) / (s.charEnd - s.charStart));
    if (t <= 0) continue;
    // split the curve at t so a growing limb follows its final shape
    const end = curvePoint(s, t);
    const qx0 = lerp(s.x0, s.cx, t);
    const qy = lerp(s.y0, s.cy, t);
    const ax = s.x0 + swayAt(s.x0, s.y0, h, time, sway);
    const qx = qx0 + swayAt(qx0, qy, h, time, sway);
    const bx = end.x + swayAt(end.x, end.y, h, time, sway);
    const by = end.y;
    const ay = s.y0;

    const startLen = Math.hypot(qx - ax, qy - ay) || 1;
    const endLen = Math.hypot(bx - qx, by - qy) || 1;
    const midLen = Math.hypot(bx - ax, by - ay) || 1;
    const n0x = -(qy - ay) / startLen;
    const n0y = (qx - ax) / startLen;
    const n1x = -(by - qy) / endLen;
    const n1y = (bx - qx) / endLen;
    const nmx = -(by - ay) / midLen;
    const nmy = (bx - ax) / midLen;
    const w0 = (s.w0 * girth) / 2;
    const w1 = (lerp(s.w0, s.w1, t) * girth * (t < 1 ? 0.45 : 1)) / 2;
    const wm = (w0 + w1) / 2;

    limbs.moveTo(ax + n0x * w0, ay + n0y * w0);
    limbs.quadraticCurveTo(qx + nmx * wm, qy + nmy * wm, bx + n1x * w1, by + n1y * w1);
    limbs.lineTo(bx - n1x * w1, by - n1y * w1);
    limbs.quadraticCurveTo(qx - nmx * wm, qy - nmy * wm, ax - n0x * w0, ay - n0y * w0);
    limbs.closePath();
    joints.moveTo(ax + w0, ay);
    joints.arc(ax, ay, w0, 0, Math.PI * 2);
    if (t === 1) {
      joints.moveTo(bx + w1, by);
      joints.arc(bx, by, w1, 0, Math.PI * 2);
    }
    if (w0 > 2.2) {
      // light catches the side of the limb facing the horizon
      const lit = nmx >= 0 ? 1 : -1;
      const inner = 0.3;
      rims.moveTo(ax + lit * n0x * w0, ay + lit * n0y * w0);
      rims.quadraticCurveTo(qx + lit * nmx * wm, qy + lit * nmy * wm, bx + lit * n1x * w1, by + lit * n1y * w1);
      rims.lineTo(bx + lit * n1x * w1 * inner, by + lit * n1y * w1 * inner);
      rims.quadraticCurveTo(
        qx + lit * nmx * wm * inner,
        qy + lit * nmy * wm * inner,
        ax + lit * n0x * w0 * inner,
        ay + lit * n0y * w0 * inner,
      );
      rims.closePath();
    }
  }

  ctx.fillStyle = d.bark;
  ctx.fill(limbs);
  ctx.fill(joints);
  if (d.rimAlpha > 0) {
    ctx.globalAlpha *= d.rimAlpha;
    ctx.fillStyle = d.rim;
    ctx.fill(rims);
    ctx.globalAlpha /= d.rimAlpha;
  }

  const path = leafFor(p.shape);
  const keep = d.leafKeep ?? 1;
  let fill = '';
  for (const { leaf, fill: color } of p.order) {
    const open =
      leaf.charAt < 0 ? 1 - clamp01((reveal - 16) / 24) : clamp01((reveal - leaf.charAt) / 7);
    if (open <= 0 || leaf.rand > keep) continue;
    const size = leaf.size * easeOutBack(open);
    if (color !== fill) {
      ctx.fillStyle = color;
      fill = color;
    }
    const lx = leaf.x + swayAt(leaf.x, leaf.y, h, time, sway);
    const rot = leaf.rot + (sway ? Math.sin(time * 1.9 + leaf.rand * 9) * 0.1 : 0);
    ctx.save();
    ctx.translate(lx, leaf.y);
    ctx.rotate(rot);
    ctx.scale(size, size);
    ctx.fill(path);
    ctx.restore();
  }
}

/** Renders a finished tree into its own canvas, root centered on the bottom edge. */
export function treeSprite(
  p: Painted,
  world: World,
  width: number,
  height: number,
  scale: number,
  opts: Partial<TreeDraw> = {},
): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = width;
  c.height = height;
  const ctx = c.getContext('2d');
  if (!ctx) return c;
  ctx.translate(width / 2, height - 4);
  ctx.scale(scale, scale);
  drawTree(ctx, p, {
    reveal: Number.MAX_SAFE_INTEGER,
    time: 0,
    sway: 0,
    bark: world.bark,
    rim: world.rim,
    rimAlpha: 0.35,
    ...opts,
  });
  return c;
}

const BUG_FRAMES = [
  ['..x..x..', '...xx...', 'x.xxxx.x', '.xxoxxx.', 'x.xxxx.x', '.xxxxxx.', 'x..xx..x'],
  ['.x....x.', '...xx...', '.xxxxxx.', 'x.xoxx.x', '.xxxxxx.', 'x.xxxx.x', '...xx...'],
];

/** Two walk frames of the pixel bug, 8×7 cells at `cell` pixels each. */
export function bugSprites(body: string, spot: string, cell: number): HTMLCanvasElement[] {
  return BUG_FRAMES.map((rows) => {
    const c = document.createElement('canvas');
    c.width = 8 * cell;
    c.height = 7 * cell;
    const ctx = c.getContext('2d');
    if (!ctx) return c;
    rows.forEach((row, y) => {
      [...row].forEach((ch, x) => {
        if (ch === '.') return;
        ctx.fillStyle = ch === 'o' ? spot : body;
        ctx.fillRect(x * cell, y * cell, cell, cell);
      });
    });
    return c;
  });
}

/** Soft round light used for fireflies and the lantern. */
export function glowSprite(color: string, size: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  if (!ctx) return c;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, color);
  g.addColorStop(0.18, `${color}cc`);
  g.addColorStop(0.45, `${color}33`);
  g.addColorStop(1, `${color}00`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return c;
}
