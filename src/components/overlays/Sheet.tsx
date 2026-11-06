import { motion } from 'motion/react';
import { useEffect, useRef, type ReactNode } from 'react';
import { closeOverlay } from '../../commands';
import { Icon } from '../icons';

const FOCUSABLE = 'button, input, select, [tabindex="0"]';

/** closing gets out of the way quickly, since people usually go straight back to typing */
const QUICK_EXIT = { duration: 0.16, ease: 'easeIn' } as const;

/** Paper sheet that slides over the scene. Keyboard focus stays inside while open. */
export function Sheet({ title, children, wide }: { title: string; children: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const before = document.activeElement as HTMLElement | null;
    ref.current?.focus({ preventScroll: true });
    return () => before?.blur?.();
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !ref.current) return;
    const items = [...ref.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || active === ref.current)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <>
      <motion.div
        className="sheet-scrim"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: QUICK_EXIT }}
        onMouseDown={closeOverlay}
      />
      <motion.div
        ref={ref}
        className={wide ? 'sheet wide' : 'sheet'}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        initial={{ x: 60, rotate: 1.2, opacity: 0 }}
        animate={{ x: 0, rotate: 0, opacity: 1 }}
        exit={{ x: 60, rotate: 1, opacity: 0, transition: QUICK_EXIT }}
        transition={{ type: 'spring', stiffness: 340, damping: 32 }}
      >
        <header className="sheet-head">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={closeOverlay} aria-label={`Close ${title}`}>
            <Icon name="x" size={18} />
          </button>
        </header>
        <div className="sheet-body">{children}</div>
      </motion.div>
    </>
  );
}
