import { CORRECT, WRONG, type EngineState } from '../engine/typingEngine';
import { mix } from './color';
import {
  bugSprites,
  clamp01,
  curvePoint,
  drawTree,
  easeOutBack,
  easeOutCubic,
  glowSprite,
  lerp,
  paintLeaves,
  treeSprite,
  type Painted,
} from './render';
import type { LeafShape } from './species';
import type { Tree } from './tree';
import type { World } from './worlds';

interface Bug {
  char: number;
  seg: number;
  /** position along its segment */
  u: number;
  dir: number;
  speed: number;
  /** 0 while leaving the caret, 1 once on the tree */
  hop: number;
  fromX: number;
  fromY: number;
  phase: number;
}

interface Puff {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  color: string;
  gravity: number;
}

interface Firefly {
  x: number;
  y: number;
  phase: number;
  radius: number;
  speed: number;
  alpha: number;
}

interface GroveTree {
  sprite: HTMLCanvasElement;
  /** sprite pixels per tree unit */
  fromScale: number;
  fromX: number;
  fromY: number;
  slot: number;
  t: number;
}

/** extra width on hill layers so they can drift without showing an edge */
const OVERSCAN = 28;
const MAX_PUFFS = 140;
const MAX_VISIBLE_BUGS = 24;
const MAX_GROVE = 6;
const GROVE_SLOTS = [-0.3, 0.3, -0.42, 0.42, -0.17, 0.17];

const rand = (a: number, b: number) => a + Math.random() * (b - a);

function makeLayer(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = Math.max(1, w);
  c.height = Math.max(1, h);
  return c;
}

/** The whole landscape: drawn on one canvas that sits behind the interface. */
export class GardenScene {
  private ctx: CanvasRenderingContext2D | null;
  private W = 1;
  private H = 1;
  private dpr = 1;
  private codeRight = 0;
  private world: World;
  private calm = false;

  private backdrop: HTMLCanvasElement | null = null;
  private dawnGlow: HTMLCanvasElement | null = null;
  private layers: HTMLCanvasElement[] = [];
  private stars: { x: number; y: number; r: number; phase: number }[] = [];
  private bugFrames: HTMLCanvasElement[] = [];
  private flyGlow: HTMLCanvasElement | null = null;

  private tree: Tree | null = null;
  private painted: Painted | null = null;
  private shape: LeafShape = 'round';
  private charColors: string[] | null = null;
  private fading: { painted: Painted; reveal: number; alpha: number } | null = null;

  private target = 0;
  private reveal = 0;
  private wind = 0;
  private windTarget = 0;
  private dawn = 0;
  private dawnTarget = 0;
  private focus = 0;
  private focusTarget = 0;
  private intro = 0;
  private introLength = 1.2;
  private streak = 0;
  private personalBest = false;
  private lanternSeg = -1;

  private bugs = new Map<number, Bug>();
  private puffs: Puff[] = [];
  private flies: Firefly[] = [];
  private grove: GroveTree[] = [];

  private raf = 0;
  private last = 0;
  private dead = false;

  constructor(canvas: HTMLCanvasElement, world: World) {
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.world = world;
  }

  destroy() {
    this.dead = true;
    if (this.raf) cancelAnimationFrame(this.raf);
  }

  resize(canvas: HTMLCanvasElement, w: number, h: number, codeRight: number) {
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.W = w;
    this.H = h;
    this.codeRight = codeRight;
    canvas.width = Math.round(w * this.dpr);
    canvas.height = Math.round(h * this.dpr);
    this.buildLayers();
    this.wake();
  }

  setWorld(world: World) {
    this.world = world;
    this.buildLayers();
    if (this.tree) this.painted = this.paint();
    this.wake();
  }

  setCalm(calm: boolean) {
    this.calm = calm;
    if (calm) {
      this.puffs = [];
      this.flies = [];
      this.intro = this.introLength;
      this.reveal = this.target;
      this.focus = this.focusTarget;
      this.dawn = this.dawnTarget;
    }
    this.wake();
  }

  /** Starts a new tree. The previous one fades out where it stands. */
  plant(tree: Tree, shape: LeafShape, reveal: number, longIntro: boolean) {
    if (this.painted && this.tree !== tree) {
      this.fading = { painted: this.painted, reveal: this.reveal, alpha: 1 };
    }
    this.tree = tree;
    this.shape = shape;
    this.charColors = null;
    this.painted = this.paint();
    this.target = reveal;
    this.reveal = reveal;
    this.bugs.clear();
    this.streak = 0;
    this.lanternSeg = -1;
    this.personalBest = false;
    this.introLength = longIntro ? 1.2 : 0.5;
    this.intro = this.calm ? this.introLength : 0;
    this.wake();
  }

  setLeafColors(colors: string[] | null) {
    this.charColors = colors;
    if (this.tree) this.painted = this.paint();
    this.wake();
  }

  private paint() {
    const { tree, shape, charColors, world } = this;
    return paintLeaves(tree as Tree, shape, charColors, world.leaves, world.accent);
  }

  setRhythm(wind: number, dawn: number) {
    this.windTarget = wind;
    if (this.dawnTarget !== dawn) {
      this.dawnTarget = dawn;
      if (this.calm) this.dawn = dawn;
      this.wake();
    }
  }

  /** Called for every engine change. Only looks at the positions that moved. */
  update(prev: EngineState, next: EngineState) {
    this.target = next.pos;
    if (this.intro < this.introLength) this.intro = this.introLength;
    const lo = Math.min(prev.pos, next.pos);
    const hi = Math.max(prev.pos, next.pos);
    for (let i = lo; i < hi; i++) {
      const was = prev.status[i] === WRONG;
      const is = next.status[i] === WRONG;
      if (is && !was) this.spawnBug(i);
      else if (was && !is) this.squash(i);
    }
    if (next.pos === prev.pos + 1) {
      if (next.status[prev.pos] === CORRECT) {
        this.streak++;
        this.pollen();
      } else if (next.status[prev.pos] === WRONG) {
        this.streak = 0;
      }
    }
    if (this.calm) this.reveal = this.target;
    this.wake();
  }

  /** A clean slate for a restart on the same snippet. */
  rewind() {
    for (const char of [...this.bugs.keys()]) this.squash(char);
    this.target = 0;
    this.streak = 0;
    if (this.calm) this.reveal = 0;
    this.wake();
  }

  setFinished(finished: boolean, personalBest: boolean) {
    this.focusTarget = finished ? 1 : 0;
    this.personalBest = finished && personalBest;
    if (finished) {
      this.dawnTarget = 1;
      if (personalBest) this.lanternSeg = this.pickLanternBranch();
      if (!this.calm) this.releaseFireflies(personalBest ? 26 : 10);
    } else {
      this.lanternSeg = -1;
    }
    if (this.calm) {
      this.focus = this.focusTarget;
      this.dawn = this.dawnTarget;
    }
    this.wake();
  }

  /** Time mode: the finished tree shrinks into the background and a new seed starts. */
  rollover() {
    if (!this.tree || !this.painted) return;
    const { ax, ay, s } = this.placement();
    const scale = 0.6;
    // the root sits mid-sprite, so the sprite spans the wider side twice
    const width = Math.ceil((Math.max(-this.tree.minX, this.tree.maxX) * 2 + 40) * scale);
    const height = Math.ceil((-this.tree.minY + 16) * scale);
    const sprite = treeSprite(this.painted, this.world, Math.max(width, 2), Math.max(height, 2), scale);
    this.grove.push({
      sprite,
      fromScale: s / scale,
      fromX: ax,
      fromY: ay,
      slot: this.grove.length % GROVE_SLOTS.length,
      t: this.calm ? 1 : 0,
    });
    if (this.grove.length > MAX_GROVE) this.grove.shift();
    this.painted = null;
    this.fading = null;
  }

  clearGrove() {
    this.grove = [];
    this.wake();
  }

  // ---------------------------------------------------------------- layout

  private get phone() {
    return this.W < 700;
  }

  private get medium() {
    return !this.phone && this.W < 1100;
  }

  /** bottom of the part of the screen the landscape occupies */
  private get horizonH() {
    return this.phone ? Math.min(230, this.H * 0.3) : this.H;
  }

  private restingAnchor() {
    if (this.phone) return this.W * 0.52;
    if (this.medium) return this.W * 0.8;
    return this.codeRight + (this.W - this.codeRight) * 0.5;
  }

  private ground(x: number, layer: number): number {
    const H = this.horizonH;
    const W = this.W;
    const phase = [0.4, 1.7, 3.1][layer];
    const base = [0.76, 0.83, 0.9][layer] * H;
    const amp = [0.055, 0.04, 0.022][layer] * H;
    let y =
      base +
      Math.sin((x / W) * Math.PI * [3.4, 4.6, 1.4][layer] + phase) * amp +
      Math.sin((x / W) * Math.PI * 7.3 + phase * 2) * amp * 0.3;
    if (layer < 2 && !this.phone) {
      // far hills sink out of sight before they reach the code
      const edge = this.medium ? W * 0.45 : this.codeRight;
      const t = clamp01((x - edge * 0.45) / (edge * 0.68));
      y += (1 - t * t * (3 - 2 * t)) * H * 0.3;
    }
    if (layer === 2) {
      const d = (x - this.restingAnchor()) / (W * 0.2);
      y -= H * 0.05 * Math.exp(-d * d);
    }
    return y;
  }

  /** root position and scale of the tree right now */
  private placement() {
    const tree = this.tree;
    const rest = this.restingAnchor();
    const center = this.W * 0.5;
    const ax = lerp(rest, center, this.focus);
    const ay = this.ground(ax, 2) + 3;
    if (!tree) return { ax, ay, s: 1 };
    const top = this.phone ? 62 : 84;
    const roomH = ay - top;
    const restW = this.phone
      ? this.W * 0.9
      : this.medium
        ? this.W * 0.5
        : this.W - this.codeRight - 16;
    const roomW = lerp(restW, Math.max(restW, this.W * 0.42), this.focus);
    const width = tree.maxX - tree.minX || 1;
    const height = -tree.minY || 1;
    const s = Math.min(roomW / width, roomH / height, 1.7);
    return { ax: ax - ((tree.minX + tree.maxX) / 2) * s, ay, s };
  }

  private buildLayers() {
    const { W, H, dpr, world } = this;
    const pw = Math.ceil(W * dpr);
    const ph = Math.ceil(H * dpr);
    const horizon = this.horizonH;
    const anchor = this.restingAnchor();

    const back = makeLayer(pw, ph);
    const b = back.getContext('2d');
    if (!b) return;
    b.scale(dpr, dpr);
    b.fillStyle = world.plate;
    b.fillRect(0, 0, W, H);
    const reach = this.phone ? W * 0.9 : Math.max(W - this.codeRight, W * 0.2) * 1.5;
    const sky = b.createRadialGradient(anchor, horizon, 0, anchor, horizon, reach);
    sky.addColorStop(0, world.sky);
    sky.addColorStop(0.55, mix(world.sky, world.plate, 0.45));
    sky.addColorStop(1, world.plate);
    b.fillStyle = sky;
    b.fillRect(0, 0, W, horizon);

    this.stars = [];
    if (world.kind === 'dark') {
      const left = this.phone ? 0 : this.medium ? W * 0.5 : this.codeRight * 0.96;
      const count = Math.round(((W - left) * horizon) / 11000);
      for (let i = 0; i < count; i++) {
        this.stars.push({
          x: rand(left, W),
          y: rand(0, horizon * 0.62),
          r: rand(0.6, 1.5),
          phase: rand(0, 6.28),
        });
      }
    }

    const orbR = this.phone ? 18 : Math.min(W, H) * 0.046;
    const orbX = this.phone ? W * 0.84 : W - Math.max(70, W * 0.075);
    const orbY = this.phone ? 134 : H * 0.17;
    b.globalAlpha = 0.14;
    b.fillStyle = world.orb;
    b.beginPath();
    b.arc(orbX, orbY, orbR * 1.45, 0, Math.PI * 2);
    b.fill();
    b.globalAlpha = 1;
    b.beginPath();
    b.arc(orbX, orbY, orbR, 0, Math.PI * 2);
    b.fill();
    if (world.kind === 'dark') {
      b.fillStyle = mix(world.orb, world.sky, 0.14);
      for (const [dx, dy, r] of [[-0.3, -0.2, 0.22], [0.28, 0.12, 0.14], [-0.08, 0.4, 0.11]]) {
        b.beginPath();
        b.arc(orbX + dx * orbR, orbY + dy * orbR, r * orbR, 0, Math.PI * 2);
        b.fill();
      }
    }
    this.backdrop = back;

    const glowSize = Math.ceil(Math.max(W, H) * 0.9);
    const glow = makeLayer(glowSize, glowSize);
    const g = glow.getContext('2d');
    if (g) {
      const r = glowSize / 2;
      const grad = g.createRadialGradient(r, r, 0, r, r, r);
      grad.addColorStop(0, world.horizon);
      grad.addColorStop(0.3, `${world.horizon}99`);
      grad.addColorStop(0.65, `${world.horizon}22`);
      grad.addColorStop(1, `${world.horizon}00`);
      g.fillStyle = grad;
      g.fillRect(0, 0, glowSize, glowSize);
    }
    this.dawnGlow = glow;

    this.layers = [0, 1, 2].map((layer) => {
      const c = makeLayer(pw + Math.ceil(OVERSCAN * dpr), ph);
      const l = c.getContext('2d');
      if (!l) return c;
      l.scale(dpr, dpr);
      const color = layer === 2 && this.phone ? world.plate : world.hills[layer];
      const outline = () => {
        l.beginPath();
        l.moveTo(0, H + 4);
        for (let x = 0; x <= W + OVERSCAN; x += 14) l.lineTo(x, this.ground(x, layer));
        l.lineTo(W + OVERSCAN, H + 4);
        l.closePath();
      };
      // the hard offset edge is what makes the hills read as stacked paper
      l.fillStyle = mix(color, world.kind === 'dark' ? '#000000' : '#26524A', 0.28);
      l.save();
      l.translate(0, -5);
      outline();
      l.fill();
      l.restore();
      l.fillStyle = color;
      outline();
      l.fill();
      return c;
    });

    this.bugFrames = bugSprites(world.bug, mix(world.bug, '#ffffff', 0.55), 2);
    this.flyGlow = glowSprite(world.firefly, 42);
  }

  // ---------------------------------------------------------------- events

  private segmentPoint(seg: number, u: number, time: number) {
    const tree = this.tree;
    if (!tree) return { x: 0, y: 0 };
    const s = tree.segments[seg];
    const { ax, ay, s: scale } = this.placement();
    const h = -tree.minY || 1;
    const { x, y } = curvePoint(s, u);
    const k = -y / h;
    const sway = this.swayAmount() * k * k * Math.sin(time * 1.25 + y * 0.012 + x * 0.006);
    return { x: ax + (x + sway) * scale, y: ay + y * scale };
  }

  private swayAmount() {
    return this.calm ? 0 : 2.5 + this.wind * 8;
  }

  private spawnBug(char: number) {
    if (!this.tree) return;
    const caret = document.querySelector('.caret')?.getBoundingClientRect();
    const seg = this.tree.charSeg[Math.min(char, this.tree.charSeg.length - 1)];
    this.bugs.set(char, {
      char,
      seg,
      u: rand(0.2, 0.8),
      dir: Math.random() < 0.5 ? -1 : 1,
      speed: rand(0.05, 0.14),
      hop: this.calm ? 1 : 0,
      fromX: caret ? caret.left : this.W * 0.3,
      fromY: caret ? caret.top : this.H * 0.4,
      phase: rand(0, 6.28),
    });
  }

  private squash(char: number) {
    const bug = this.bugs.get(char);
    if (!bug) return;
    this.bugs.delete(char);
    if (this.calm) return;
    const p = this.segmentPoint(bug.seg, bug.u, this.last / 1000);
    for (let i = 0; i < 9; i++) {
      this.addPuff(p.x, p.y, rand(-90, 90), rand(-110, 20), rand(0.3, 0.55), rand(1.5, 3), this.world.bug, 240);
    }
  }

  private addPuff(
    x: number,
    y: number,
    vx: number,
    vy: number,
    life: number,
    size: number,
    color: string,
    gravity: number,
  ) {
    if (this.puffs.length >= MAX_PUFFS) this.puffs.shift();
    this.puffs.push({ x, y, vx, vy, life, max: life, size, color, gravity });
  }

  private pollen() {
    if (this.calm || !this.tree) return;
    const seg = this.tree.charSeg[Math.min(this.target, this.tree.charSeg.length - 1)];
    const s = this.tree.segments[seg];
    const t = clamp01((this.target - s.charStart) / (s.charEnd - s.charStart));
    const p = this.segmentPoint(seg, t, this.last / 1000);
    this.addPuff(p.x, p.y, rand(-26, 26), rand(-46, -10), rand(0.35, 0.7), rand(1, 2.2), this.world.firefly, -6);
  }

  private pickLanternBranch() {
    const tree = this.tree;
    if (!tree) return -1;
    let best = -1;
    let bestScore = -Infinity;
    tree.segments.forEach((s, i) => {
      if (!s.isTwig) return;
      const score = Math.abs(s.x1) - Math.abs(s.y1 - tree.minY * 0.55) * 0.8;
      if (score > bestScore) {
        bestScore = score;
        best = i;
      }
    });
    return best;
  }

  private releaseFireflies(count: number) {
    const { ax, ay, s } = this.placement();
    const height = this.tree ? -this.tree.minY * s : 200;
    while (this.flies.length < count) {
      this.flies.push({
        x: ax + rand(-height * 0.55, height * 0.55),
        y: ay - rand(10, height),
        phase: rand(0, 6.28),
        radius: rand(10, 34),
        speed: rand(0.5, 1.2),
        alpha: 0,
      });
    }
  }

  // ---------------------------------------------------------------- loop

  private wake() {
    if (this.raf || this.dead) return;
    this.raf = requestAnimationFrame(this.frame);
  }

  private frame = (now: number) => {
    this.raf = 0;
    if (this.dead) return;
    const dt = this.last ? Math.min(0.05, (now - this.last) / 1000) : 0.016;
    this.last = now;
    this.advance(dt);
    this.draw(now / 1000);
    if (!this.calm || this.isSettling()) this.wake();
  };

  private isSettling() {
    return this.bugs.size > 0 && [...this.bugs.values()].some((b) => b.hop < 1);
  }

  private advance(dt: number) {
    const ease = (rate: number) => 1 - Math.exp(-dt * rate);
    this.reveal += (this.target - this.reveal) * ease(16);
    this.wind += (this.windTarget - this.wind) * ease(1.5);
    this.dawn += (this.dawnTarget - this.dawn) * ease(1.4);
    this.focus += (this.focusTarget - this.focus) * ease(3.6);
    if (this.intro < this.introLength) this.intro = Math.min(this.introLength, this.intro + dt);
    if (this.fading) {
      this.fading.alpha -= dt * 3.2;
      if (this.fading.alpha <= 0) this.fading = null;
    }

    for (const g of this.grove) if (g.t < 1) g.t = Math.min(1, g.t + dt * 1.4);

    for (const bug of this.bugs.values()) {
      if (bug.hop < 1) {
        bug.hop = Math.min(1, bug.hop + dt * 2.1);
        continue;
      }
      bug.u += bug.dir * bug.speed * dt;
      if (bug.u > 0.92 || bug.u < 0.08) {
        bug.dir = -bug.dir;
        bug.u = clamp01(bug.u);
      }
    }

    for (let i = this.puffs.length - 1; i >= 0; i--) {
      const p = this.puffs[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.puffs.splice(i, 1);
        continue;
      }
      p.vy += p.gravity * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }

    if (!this.calm) {
      const finished = this.focusTarget === 1;
      const want = finished ? this.flies.length : Math.min(14, Math.floor(this.streak / 20));
      if (!finished && this.flies.length < want) this.releaseFireflies(want);
      for (let i = this.flies.length - 1; i >= 0; i--) {
        const f = this.flies[i];
        const fadeOut = !finished && i >= want;
        f.alpha = clamp01(f.alpha + (fadeOut ? -dt * 2 : dt * 1.2));
        f.phase += dt * f.speed;
        if (fadeOut && f.alpha === 0) this.flies.splice(i, 1);
      }
    }
  }

  private draw(time: number) {
    const ctx = this.ctx;
    if (!ctx || !this.backdrop) return;
    const { W, H, dpr, world } = this;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.drawImage(this.backdrop, 0, 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (this.stars.length) {
      ctx.fillStyle = world.orb;
      const fade = 1 - this.dawn * 0.75;
      for (const s of this.stars) {
        ctx.globalAlpha = (0.35 + 0.55 * (0.5 + 0.5 * Math.sin(time * 0.9 + s.phase))) * fade;
        ctx.fillRect(s.x, s.y, s.r, s.r);
      }
      ctx.globalAlpha = 1;
    }

    const { ax, ay, s } = this.placement();

    if (this.dawnGlow && this.dawn > 0.002) {
      const size = this.phone ? W * 1.3 : Math.max(W, H) * (0.52 + 0.3 * this.focus);
      ctx.globalAlpha = this.dawn * (world.kind === 'dark' ? 0.75 : 0.9);
      ctx.drawImage(this.dawnGlow, ax - size / 2, ay - size / 2, size, size);
      ctx.globalAlpha = 1;
    }

    const drift = (this.target / Math.max(1, this.tree?.length ?? 1)) * 10;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (this.layers[0]) ctx.drawImage(this.layers[0], -drift * dpr * 0.4, 0);
    if (this.layers[1]) ctx.drawImage(this.layers[1], -drift * dpr * 0.7, 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    this.drawGrove(ax);

    if (this.layers[2]) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(this.layers[2], 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // on mid-size screens the tree stands behind the code, so it stays faint
    const treeAlpha = this.medium ? lerp(0.3, 1, this.focus) : 1;
    const landing = clamp01((this.intro - this.introLength * 0.55) / (this.introLength * 0.45));
    const introScale = this.intro >= this.introLength ? 1 : easeOutBack(landing);

    if (this.fading) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.fading.alpha) * treeAlpha;
      ctx.translate(ax, ay);
      ctx.scale(s, s);
      drawTree(ctx, this.fading.painted, {
        reveal: this.fading.reveal,
        time,
        sway: this.swayAmount(),
        bark: world.bark,
        rim: world.rim,
        rimAlpha: 0.2,
      });
      ctx.restore();
    }

    if (this.painted && introScale > 0.001) {
      ctx.save();
      ctx.globalAlpha = treeAlpha;
      ctx.translate(ax, ay);
      ctx.scale(s * introScale, s * introScale);
      drawTree(ctx, this.painted, {
        reveal: this.reveal,
        time,
        sway: this.swayAmount(),
        bark: world.bark,
        rim: world.rim,
        rimAlpha: 0.2 + this.dawn * 0.65,
      });
      ctx.restore();
    }

    if (this.intro < this.introLength * 0.55) this.drawSeed(ax, ay);

    this.drawLantern(time);
    this.drawBugs(time);

    for (const p of this.puffs) {
      ctx.globalAlpha = clamp01(p.life / p.max);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }

    if (this.flyGlow && this.flies.length) {
      for (const f of this.flies) {
        const blink = 0.55 + 0.45 * Math.sin(f.phase * 3.1);
        ctx.globalAlpha = f.alpha * blink;
        const x = f.x + Math.cos(f.phase) * f.radius;
        const y = f.y + Math.sin(f.phase * 1.3) * f.radius * 0.7;
        ctx.drawImage(this.flyGlow, x - 21, y - 21);
      }
    }
    ctx.globalAlpha = 1;
  }

  private drawSeed(ax: number, ay: number) {
    const ctx = this.ctx;
    if (!ctx) return;
    const t = clamp01(this.intro / (this.introLength * 0.55));
    const y = lerp(-24, ay - 5, t * t);
    ctx.fillStyle = this.world.accent;
    ctx.beginPath();
    ctx.ellipse(ax, y, 4.5, 7, Math.sin(t * 9) * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawGrove(anchorX: number) {
    const ctx = this.ctx;
    if (!ctx) return;
    for (const g of this.grove) {
      const e = easeOutCubic(g.t);
      const slotX = anchorX + GROVE_SLOTS[g.slot] * Math.min(this.W * 0.55, this.W - this.codeRight);
      const x = lerp(g.fromX, slotX, e);
      const y = lerp(g.fromY, this.ground(x, 1) + 4, e);
      const scale = lerp(g.fromScale, 0.45, e);
      const w = g.sprite.width * scale;
      const h = g.sprite.height * scale;
      ctx.globalAlpha = lerp(1, 0.86, e);
      ctx.drawImage(g.sprite, x - w / 2, y - h, w, h);
    }
    ctx.globalAlpha = 1;
  }

  private drawLantern(time: number) {
    const ctx = this.ctx;
    if (!ctx || this.lanternSeg < 0 || !this.personalBest || !this.flyGlow) return;
    const p = this.segmentPoint(this.lanternSeg, 1, time);
    const swing = this.calm ? 0 : Math.sin(time * 1.6) * 3;
    const x = p.x + swing;
    const y = p.y + 22;
    ctx.strokeStyle = this.world.bark;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(x, y - 8);
    ctx.stroke();
    ctx.globalAlpha = 0.9;
    ctx.drawImage(this.flyGlow, x - 42, y - 42, 84, 84);
    ctx.globalAlpha = 1;
    ctx.fillStyle = this.world.firefly;
    ctx.fillRect(x - 6, y - 8, 12, 16);
    ctx.fillStyle = this.world.bark;
    ctx.fillRect(x - 7, y - 10, 14, 3);
    ctx.fillRect(x - 7, y + 7, 14, 3);
  }

  private drawBugs(time: number) {
    const ctx = this.ctx;
    if (!ctx || !this.tree || this.bugFrames.length < 2) return;
    let drawn = 0;
    const frameIndex = Math.floor(time * 7) % 2;
    for (const bug of this.bugs.values()) {
      if (drawn++ >= MAX_VISIBLE_BUGS) break;
      const seg = this.tree.segments[bug.seg];
      if (!seg) continue;
      const at = this.segmentPoint(bug.seg, bug.u, time);
      const landed = bug.hop >= 1;
      const t = easeOutCubic(bug.hop);
      const x = lerp(bug.fromX, at.x, t);
      const y = lerp(bug.fromY, at.y, t) - Math.sin(bug.hop * Math.PI) * 130;
      const frame = this.bugFrames[landed && !this.calm ? frameIndex : 0];
      const heading = Math.atan2(seg.y1 - seg.y0, seg.x1 - seg.x0) + (bug.dir > 0 ? Math.PI / 2 : -Math.PI / 2);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(landed ? heading : bug.hop * 8);
      ctx.drawImage(frame, -frame.width / 2, -frame.height / 2);
      ctx.restore();
    }
  }
}
