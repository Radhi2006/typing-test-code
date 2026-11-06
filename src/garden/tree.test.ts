import { describe, expect, it } from 'vitest';
import { SNIPPETS } from '../snippets';
import { migrateSettings } from '../store/migrate';
import { contrast, isGrey, liftContrast, mix } from './color';
import { SPECIES } from './species';
import { buildTree, hashSeed } from './tree';
import { WORLDS } from './worlds';

const species = SPECIES.javascript;

describe('buildTree', () => {
  it('is deterministic for a seed and varies between seeds', () => {
    const code = 'if (a) {\n  b();\n}\nc();';
    expect(buildTree(code, species, 7).segments).toEqual(buildTree(code, species, 7).segments);
    expect(buildTree(code, species, 7).segments).not.toEqual(buildTree(code, species, 8).segments);
  });

  it('forks where the code nests', () => {
    const widestFork = (code: string) => {
      const kids = new Map<number, number>();
      for (const s of buildTree(code, species, 1).segments) {
        if (!s.isTwig) kids.set(s.parent, (kids.get(s.parent) ?? 0) + 1);
      }
      return Math.max(...kids.values());
    };
    expect(widestFork('alpha();\nbeta();\ngamma();\ndelta();')).toBe(1);
    expect(widestFork('alpha(); {\n  beta();\n  gamma();\n}\ndelta();')).toBe(2);
  });

  it('keeps the block under a brace on its own line', () => {
    const allman = 'struct Vec\n{\n    int x;\n    int y;\n}\nint z;';
    const sameLine = 'struct Vec {\n    int x;\n    int y;\n}\nint z;';
    const main = (code: string) => buildTree(code, species, 2).segments.filter((s) => !s.isTwig);
    expect(main(allman)).toHaveLength(4);
    expect(main(allman).length).toBe(main(sameLine).length);
  });

  it('gives every readable line its own stretch of branch', () => {
    const tree = buildTree('one();\n\n  two();\n}\nthree();', species, 3);
    expect(tree.segments.filter((s) => !s.isTwig)).toHaveLength(3);
  });

  it('survives code with no readable lines', () => {
    expect(buildTree('}\n}', species, 1).segments.length).toBeGreaterThan(0);
  });

  it('builds a sound tree for every bundled snippet', () => {
    expect(SNIPPETS.length).toBeGreaterThan(200);
    for (const s of SNIPPETS) {
      const tree = buildTree(s.code, SPECIES[s.lang], hashSeed(s.id));
      expect(tree.segments.length).toBeLessThan(500);
      expect(tree.leaves.length).toBeLessThan(900);
      expect(tree.minY).toBeLessThan(0);
      tree.segments.forEach((seg, i) => {
        expect(seg.parent).toBeLessThan(i);
        expect(seg.charEnd).toBeGreaterThan(seg.charStart);
        expect(seg.charEnd).toBeLessThanOrEqual(s.code.length + 1);
        for (const v of [seg.x0, seg.y0, seg.x1, seg.y1, seg.cx, seg.cy, seg.w0, seg.w1]) {
          expect(Number.isFinite(v)).toBe(true);
        }
      });
      for (const l of tree.leaves) {
        expect(Number.isFinite(l.x + l.y + l.rot)).toBe(true);
        expect(l.colorChar).toBeLessThan(s.code.length);
      }
      expect(tree.charSeg.length).toBe(s.code.length + 1);
      expect(Math.min(...tree.charSeg)).toBeGreaterThanOrEqual(0);
    }
  });
});

describe('color', () => {
  it('leaves readable colors alone and lifts dim ones', () => {
    expect(liftContrast('#ffffff', '#000000', '#ffffff', 4.5)).toBe('#ffffff');
    const lifted = liftContrast('#333333', '#000000', '#ffffff', 4.5);
    expect(contrast(lifted, '#000000')).toBeGreaterThanOrEqual(4.5);
  });

  it('recognises colors without a hue', () => {
    expect(isGrey('#1f2328')).toBe(true);
    expect(isGrey('#e0def4')).toBe(true);
    expect(isGrey('#cf222e')).toBe(false);
  });

  it('accounts for the opacity of untyped code', () => {
    const lifted = liftContrast('#777777', '#000000', '#ffffff', 4.5, 0.7);
    expect(contrast(mix('#000000', lifted, 0.7), '#000000')).toBeGreaterThanOrEqual(4.5);
  });

  it('keeps world text readable', () => {
    for (const w of WORLDS) {
      expect(contrast(w.text, w.plate)).toBeGreaterThanOrEqual(7);
      expect(contrast(w.muted, w.plate)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(w.muted, w.paper)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(w.accentInk, w.accent)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(mix(w.plate, w.text, w.untyped), w.plate)).toBeGreaterThanOrEqual(4.5);
      // live stats sit on the nearest hill
      expect(contrast(w.text, w.hills[2])).toBeGreaterThanOrEqual(7);
      expect(contrast(w.muted, w.hills[2])).toBeGreaterThanOrEqual(4.5);
      expect(contrast(w.bug, w.hills[2])).toBeGreaterThanOrEqual(4.5);
      expect(contrast(w.accent, w.hills[2])).toBeGreaterThanOrEqual(3);
    }
  });
});

describe('migrateSettings', () => {
  it('maps every old theme to a world and drops editor fields', () => {
    const out = migrateSettings(
      {
        theme: 'nord',
        sidebarOpen: true,
        sidebarView: 'stats',
        panelOpen: false,
        showMinimap: true,
        fontSize: 20,
        lang: 'go',
      },
      1,
    );
    expect(out).toEqual({ world: 'aurora', fontSize: 20, lang: 'go' });
  });

  it('falls back to the default world for unknown themes', () => {
    expect(migrateSettings({ theme: 'nope' }, 1)).toEqual({ world: 'dusk' });
  });

  it('moves the old default font size to the new one', () => {
    expect(migrateSettings({ theme: 'nord', fontSize: 16 }, 1)).toEqual({ world: 'aurora', fontSize: 18 });
  });

  it('leaves current settings untouched', () => {
    expect(migrateSettings({ world: 'tide' }, 2)).toEqual({ world: 'tide' });
  });

  it('treats empty storage as no settings', () => {
    expect(migrateSettings(undefined, 1)).toEqual({});
  });
});
