import { useEffect, useRef } from 'react';
import { highlightChars } from '../highlight/highlighter';
import type { Snippet } from '../snippets/types';
import { useSettings } from '../store/settings';
import { liveStats, useTest } from '../store/test';
import { treeFor } from './plant';
import { GardenScene } from './scene';
import { SPECIES } from './species';
import { WORLD_BY_ID } from './worlds';

function prefersCalm() {
  return (
    useSettings.getState().scene === 'calm' ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Bridges the stores and the canvas. It subscribes outside React so a keystroke
 * reaches the scene without rendering anything.
 */
export function GardenCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const scene = new GardenScene(canvas, WORLD_BY_ID[useSettings.getState().world]);
    let colorRequest = 0;

    const fetchColors = (snippet: Snippet) => {
      const request = ++colorRequest;
      highlightChars(snippet.code, snippet.lang, useSettings.getState().world, snippet.id)
        .then((c) => {
          if (request === colorRequest) scene.setLeafColors(c.colors);
        })
        .catch((err) => console.error('leaf colors failed', err));
    };

    const plant = (snippet: Snippet, reveal: number, longIntro: boolean) => {
      scene.plant(treeFor(snippet), SPECIES[snippet.lang].leaf, reveal, longIntro);
      fetchColors(snippet);
    };

    const measure = () => {
      const code = document.querySelector('.code-window');
      const right = code ? code.getBoundingClientRect().right : window.innerWidth * 0.6;
      scene.resize(canvas, window.innerWidth, window.innerHeight, right);
    };

    measure();
    scene.setCalm(prefersCalm());
    const start = useTest.getState();
    plant(start.snippet, start.engine.pos, true);

    const offTest = useTest.subscribe((s, prev) => {
      if (s.snippet !== prev.snippet) {
        if (s.snippetsDone > prev.snippetsDone) scene.rollover();
        plant(s.snippet, s.engine.pos, false);
      } else if (s.engine !== prev.engine) {
        if (s.engine.pos === 0 && prev.engine.pos > 0) scene.rewind();
        else scene.update(prev.engine, s.engine);
      }
      if (s.phase !== prev.phase) {
        if (s.phase === 'finished') scene.setFinished(true, Boolean(s.result?.isPersonalBest));
        else if (prev.phase === 'finished') scene.setFinished(false, false);
        if (s.phase === 'idle') scene.clearGrove();
      }
    });

    const offSettings = useSettings.subscribe((s, prev) => {
      if (s.world !== prev.world) {
        scene.setWorld(WORLD_BY_ID[s.world]);
        fetchColors(useTest.getState().snippet);
      }
      if (s.scene !== prev.scene) scene.setCalm(prefersCalm());
      if (s.fontSize !== prev.fontSize) measure();
    });

    const rhythm = window.setInterval(() => {
      const s = useTest.getState();
      const { mode, timeLimit } = useSettings.getState();
      const stats = liveStats(s, performance.now());
      const progress =
        mode === 'time'
          ? stats.elapsed / (timeLimit * 1000)
          : s.engine.pos / Math.max(1, s.snippet.code.length);
      scene.setRhythm(
        s.phase === 'running' ? Math.min(1, stats.wpm / 90) : 0,
        s.phase === 'finished' ? 1 : Math.min(1, progress),
      );
    }, 300);

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = () => scene.setCalm(prefersCalm());
    motion.addEventListener('change', onMotion);
    window.addEventListener('resize', measure);

    return () => {
      offTest();
      offSettings();
      window.clearInterval(rhythm);
      motion.removeEventListener('change', onMotion);
      window.removeEventListener('resize', measure);
      scene.destroy();
    };
  }, []);

  return <canvas ref={ref} className="garden" aria-hidden="true" />;
}
