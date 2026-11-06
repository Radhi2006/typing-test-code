import { setAndRestart } from '../../commands';
import { LANG_BY_ID } from '../../snippets/languages';
import { useSettings } from '../../store/settings';
import { useUI } from '../../store/ui';
import { Icon } from '../icons';

const TIMES = [15, 30, 60, 120] as const;

export function TopBar() {
  const mode = useSettings((s) => s.mode);
  const timeLimit = useSettings((s) => s.timeLimit);
  const lang = useSettings((s) => s.lang);
  const difficulty = useSettings((s) => s.difficulty);
  const toggle = useUI((s) => s.toggleOverlay);
  const openPalette = useUI((s) => s.openPalette);

  const langName = lang === 'all' ? 'All languages' : LANG_BY_ID[lang].name;
  const level = difficulty === 'all' ? 'Any difficulty' : difficulty[0].toUpperCase() + difficulty.slice(1);

  return (
    <header className="topbar">
      <h1 className="brand">
        <svg className="brand-mark" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 22V11" />
          <path d="M12 12C12 7 8 4.5 3.5 4.5 3.5 9 6.5 12 12 12Z" />
          <path d="M12 15c0-4 3-6.5 8.5-6.5 0 4-3 6.5-8.5 6.5Z" />
        </svg>
        CodeType
      </h1>

      <div className="mode-group" role="radiogroup" aria-label="Test length">
        <button
          role="radio"
          aria-checked={mode === 'snippet'}
          className={mode === 'snippet' ? 'on' : ''}
          onClick={() => setAndRestart({ mode: 'snippet' })}
        >
          Snippet
        </button>
        {TIMES.map((t) => {
          const on = mode === 'time' && timeLimit === t;
          return (
            <button
              key={t}
              role="radio"
              aria-checked={on}
              aria-label={`${t} seconds`}
              className={on ? 'on' : ''}
              onClick={() => setAndRestart({ mode: 'time', timeLimit: t })}
            >
              {t}s
            </button>
          );
        })}
      </div>

      <button className="seed-chip" onClick={() => toggle('library')} title="Choose what to type (Ctrl+B)">
        <span>{langName}</span>
        <span className="seed-level">{level}</span>
        <Icon name="chevronDown" size={14} />
      </button>

      <nav className="topnav" aria-label="Main">
        <button onClick={() => toggle('forest')} title="Forest (Ctrl+J)">
          <Icon name="tree" size={18} />
          <span>Forest</span>
        </button>
        <button onClick={() => toggle('settings')} title="Settings (Ctrl+,)" aria-label="Settings">
          <Icon name="gear" size={18} />
        </button>
        <button
          onClick={() => openPalette('commands')}
          title="All commands (Ctrl+Shift+P)"
          aria-label="All commands"
        >
          <Icon name="search" size={18} />
        </button>
      </nav>
    </header>
  );
}
