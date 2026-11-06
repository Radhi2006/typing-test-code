import { speciesLabel } from '../../garden/plant';
import { formatTime } from '../../engine/metrics';
import { WRONG } from '../../engine/typingEngine';
import { useNow } from '../../hooks/useNow';
import { useSettings } from '../../store/settings';
import { liveStats, useTest } from '../../store/test';
import { Icon } from '../icons';

function liveBugs(status: Uint8Array) {
  let n = 0;
  for (const s of status) if (s === WRONG) n++;
  return n;
}

export function Hud() {
  const snippet = useTest((s) => s.snippet);
  const phase = useTest((s) => s.phase);
  const bugs = useTest((s) => liveBugs(s.engine.status));
  const mode = useSettings((s) => s.mode);
  const timeLimit = useSettings((s) => s.timeLimit);
  const now = useNow(phase === 'running', 250);
  const stats = liveStats(useTest.getState(), now);
  const time =
    mode === 'time' ? formatTime(timeLimit * 1000 - stats.elapsed) : formatTime(stats.elapsed);

  return (
    <footer className="hud">
      {phase === 'idle' ? (
        <p className="hud-start">Start typing to grow this tree</p>
      ) : (
        <dl className="hud-stats">
          <div className="hud-wpm">
            <dt>wpm</dt>
            <dd>{Math.round(stats.wpm)}</dd>
          </div>
          <div>
            <dt>accuracy</dt>
            <dd>{stats.accuracy.toFixed(0)}%</dd>
          </div>
          <div>
            <dt>{mode === 'time' ? 'left' : 'time'}</dt>
            <dd>{time}</dd>
          </div>
          <div className={bugs > 0 ? 'hud-bugs live' : 'hud-bugs'}>
            <dt>{bugs === 1 ? 'bug' : 'bugs'}</dt>
            <dd>{bugs}</dd>
          </div>
        </dl>
      )}

      <div className="hud-snippet">
        <strong>{snippet.filename}</strong>
        <span>{snippet.description}</span>
        <span className="hud-species">{speciesLabel(snippet)}</span>
      </div>

      <div className="hud-actions">
        <button onClick={() => useTest.getState().restart()}>
          <Icon name="restart" size={15} /> Restart <kbd>Esc</kbd>
        </button>
        <button onClick={() => useTest.getState().next()}>
          <Icon name="shuffle" size={15} /> Next <kbd>Ctrl+Enter</kbd>
        </button>
      </div>
    </footer>
  );
}
