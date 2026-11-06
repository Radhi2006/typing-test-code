import type { ReactNode } from 'react';
import { FONT_MAX, FONT_MIN, setAndRestart } from '../../commands';
import { WORLDS } from '../../garden/worlds';
import { useSettings } from '../../store/settings';
import { Sheet } from './Sheet';

function Row({ title, desc, children }: { title: string; desc: string; children: ReactNode }) {
  return (
    <div className="setting">
      <div>
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
      <div className="setting-control">{children}</div>
    </div>
  );
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="segmented" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          role="radio"
          aria-checked={o.value === value}
          className={o.value === value ? 'on' : ''}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="toggle">
      <input
        type="checkbox"
        aria-label={label}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span aria-hidden="true" />
    </label>
  );
}

const SHORTCUTS = [
  ['Esc', 'Restart'],
  ['Ctrl+Enter', 'Next random snippet'],
  ['Enter', 'Next snippet, after finishing'],
  ['Ctrl+Backspace', 'Delete the previous word'],
  ['Ctrl+B', 'Library'],
  ['Ctrl+J', 'Forest'],
  ['Ctrl+,', 'Settings'],
  ['Ctrl+Shift+P', 'All commands'],
  ['Ctrl+P', 'Find a snippet by name'],
  ['Ctrl+= and Ctrl+-', 'Font size'],
];

export function SettingsSheet() {
  const s = useSettings();

  return (
    <Sheet title="Settings">
      <h3 className="sheet-section">World</h3>
      <div className="world-grid" role="radiogroup" aria-label="World">
        {WORLDS.map((w) => (
          <button
            key={w.id}
            role="radio"
            aria-checked={s.world === w.id}
            className={s.world === w.id ? 'world-card on' : 'world-card'}
            onClick={() => s.set({ world: w.id })}
          >
            <span className="world-art" style={{ background: w.plate }} aria-hidden="true">
              <span style={{ background: `radial-gradient(circle at 70% 100%, ${w.horizon}, ${w.sky} 55%, ${w.plate})` }} />
              <i style={{ background: w.orb }} />
              <b style={{ background: w.hills[1] }} />
              <em style={{ background: w.hills[2] }} />
            </span>
            <strong>{w.name}</strong>
            <span>{w.blurb}</span>
          </button>
        ))}
      </div>

      <h3 className="sheet-section">Motion</h3>
      <Row title="Calm scene" desc="Stops the wind, particles and popping letters. Your tree still grows as you type.">
        <Toggle
          label="Calm scene"
          checked={s.scene === 'calm'}
          onChange={(calm) => s.set({ scene: calm ? 'calm' : 'full' })}
        />
      </Row>
      <Row title="Smooth caret" desc="Slide the caret between letters.">
        <Toggle label="Smooth caret" checked={s.smoothCaret} onChange={(smoothCaret) => s.set({ smoothCaret })} />
      </Row>

      <h3 className="sheet-section">Typing</h3>
      <Row title="Auto indent" desc="Skip leading spaces after Enter. Turn this off to type every space yourself.">
        <Toggle
          label="Auto indent"
          checked={s.autoIndent}
          onChange={(autoIndent) => setAndRestart({ autoIndent })}
        />
      </Row>
      <Row title="Visible spaces" desc="Show spaces as dots.">
        <Toggle
          label="Visible spaces"
          checked={s.showWhitespace}
          onChange={(showWhitespace) => s.set({ showWhitespace })}
        />
      </Row>
      <Row title="Caret" desc="Shape of the typing caret.">
        <Segmented
          label="Caret"
          value={s.caretStyle}
          onChange={(caretStyle) => s.set({ caretStyle })}
          options={[
            { value: 'line', label: 'Line' },
            { value: 'block', label: 'Block' },
            { value: 'underline', label: 'Underline' },
          ]}
        />
      </Row>
      <Row title="Font size" desc={`${s.fontSize} pixels`}>
        <input
          type="range"
          min={FONT_MIN}
          max={FONT_MAX}
          value={s.fontSize}
          onChange={(e) => s.set({ fontSize: Number(e.target.value) })}
          aria-label="Font size"
        />
      </Row>

      <h3 className="sheet-section">Keyboard shortcuts</h3>
      <dl className="shortcut-list">
        {SHORTCUTS.map(([k, v]) => (
          <div key={k}>
            <dt>{v}</dt>
            <dd>
              <kbd>{k}</kbd>
            </dd>
          </div>
        ))}
      </dl>
    </Sheet>
  );
}
