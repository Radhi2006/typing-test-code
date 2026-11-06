import { AnimatePresence, MotionConfig } from 'motion/react';
import { useEffect } from 'react';
import { changeFontSize, closeOverlay } from './commands';
import { CommandPalette } from './components/CommandPalette';
import { Forest } from './components/overlays/Forest';
import { Library } from './components/overlays/Library';
import { SettingsSheet } from './components/overlays/SettingsSheet';
import { ResultScreen } from './components/results/ResultScreen';
import { Hud } from './components/stage/Hud';
import { TopBar } from './components/stage/TopBar';
import { TypingStage } from './components/stage/TypingStage';
import { GardenCanvas } from './garden/GardenCanvas';
import { WORLD_BY_ID, worldCssVars } from './garden/worlds';
import { handleTypingKey, isEditableTarget } from './hooks/keys';
import { useSettings } from './store/settings';
import { useTest } from './store/test';
import { useUI } from './store/ui';

function useWorld() {
  const id = useSettings((s) => s.world);
  useEffect(() => {
    const world = WORLD_BY_ID[id];
    const root = document.documentElement;
    for (const [k, v] of Object.entries(worldCssVars(world))) root.style.setProperty(k, v);
    root.dataset.world = id;
    root.style.colorScheme = world.kind;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', world.plate);
  }, [id]);
}

function useTicker() {
  const phase = useTest((s) => s.phase);
  useEffect(() => {
    if (phase !== 'running') return;
    const id = window.setInterval(() => useTest.getState().tick(performance.now()), 100);
    return () => window.clearInterval(id);
  }, [phase]);
}

function useShortcuts() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const ui = useUI.getState();
      const test = useTest.getState();
      const ctrl = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();
      let handled = true;

      if ((ctrl && e.shiftKey && key === 'p') || e.key === 'F1') ui.openPalette('commands');
      else if (ctrl && !e.shiftKey && key === 'p') ui.openPalette('files');
      else if (ui.palette) handled = false; // palette handles its own keys
      else if (e.key === 'Escape' && ui.overlay) closeOverlay();
      else if (e.key === 'Escape') test.restart();
      else if (ctrl && e.key === 'Enter') test.next();
      else if (ctrl && key === 'b') ui.toggleOverlay('library');
      else if (ctrl && key === 'j') ui.toggleOverlay('forest');
      else if (ctrl && key === ',') ui.toggleOverlay('settings');
      else if (ctrl && (e.key === '=' || e.key === '+')) changeFontSize(1);
      else if (ctrl && e.key === '-') changeFontSize(-1);
      else handled = false;

      if (handled) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      // typing from anywhere outside a form field goes to the test
      if (ui.palette || ui.overlay || isEditableTarget(e.target)) return;
      if (e.target instanceof HTMLElement && e.target.dataset.typingInput !== undefined) return;
      if (e.target instanceof HTMLButtonElement && (e.key === 'Enter' || e.key === ' ')) return;
      if (handleTypingKey(e)) {
        e.preventDefault();
        test.requestFocus();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, []);
}

/** Changing the auto-indent setting resets the engine. */
function useSettingSync() {
  useEffect(
    () =>
      useSettings.subscribe((s, prev) => {
        if (s.autoIndent !== prev.autoIndent && useTest.getState().phase !== 'running') {
          useTest.getState().restart();
        }
      }),
    [],
  );
}

export default function App() {
  useWorld();
  useTicker();
  useShortcuts();
  useSettingSync();
  const phase = useTest((s) => s.phase);
  const overlay = useUI((s) => s.overlay);
  const scene = useSettings((s) => s.scene);

  return (
    <MotionConfig reducedMotion={scene === 'calm' ? 'always' : 'user'}>
      <div className="app" data-phase={phase} data-scene={scene}>
        <GardenCanvas />
        <TopBar />
        <main className="stage">
          <TypingStage />
          <Hud />
        </main>
        <AnimatePresence>{phase === 'finished' && <ResultScreen key="result" />}</AnimatePresence>
        <AnimatePresence>
          {overlay === 'library' && <Library key="library" />}
          {overlay === 'forest' && <Forest key="forest" />}
          {overlay === 'settings' && <SettingsSheet key="settings" />}
        </AnimatePresence>
        <CommandPalette />
      </div>
    </MotionConfig>
  );
}
