import { useTest, type InputKind } from '../store/test';

type KeyLike = Pick<
  KeyboardEvent,
  'key' | 'ctrlKey' | 'altKey' | 'metaKey' | 'shiftKey' | 'isComposing' | 'preventDefault'
>;

type Action = { kind: InputKind; ch?: string } | { kind: 'next' } | { kind: 'swallow' } | null;

function resolve(e: KeyLike): Action {
  if (e.isComposing) return null;
  const st = useTest.getState();
  const plainMods = !e.ctrlKey && !e.metaKey && !e.altKey;
  if (st.phase === 'finished') {
    return e.key === 'Enter' && plainMods ? { kind: 'next' } : null;
  }
  switch (e.key) {
    case 'Backspace':
      return { kind: e.ctrlKey || e.altKey || e.metaKey ? 'deleteWord' : 'backspace' };
    case 'Enter':
      return plainMods ? { kind: 'enter' } : null;
    case 'Tab':
      if (e.ctrlKey || e.altKey || e.metaKey) return null;
      return e.shiftKey ? { kind: 'swallow' } : { kind: 'tab' };
  }
  // AltGr arrives as Ctrl+Alt on Windows and still produces a character
  const commandMod = (e.ctrlKey && !e.altKey) || e.metaKey;
  if (e.key.length === 1 && !commandMod) return { kind: 'char', ch: e.key };
  return null;
}

/** Feeds a key press into the typing test. Returns true when it was consumed.
 *  The default action is cancelled *before* the store updates, so a key can
 *  never be typed twice (once here and once through the textarea input event). */
export function handleTypingKey(e: KeyLike): boolean {
  const action = resolve(e);
  if (!action) return false;
  e.preventDefault();
  const st = useTest.getState();
  if (action.kind === 'next') st.next();
  else if (action.kind !== 'swallow') st.input(action.kind, action.ch);
  return true;
}

export function isEditableTarget(t: EventTarget | null): boolean {
  if (!(t instanceof HTMLElement)) return false;
  if (t.dataset.typingInput !== undefined) return false;
  const tag = t.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || t.isContentEditable;
}
