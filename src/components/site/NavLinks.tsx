"use client";

import { useRef, useState, type FocusEvent } from "react";

type NavLink = { readonly label: string; readonly href: string };

/**
 * Desktop nav: a soft violet pill glides behind whichever link is hovered or keyboard-focused,
 * and fades away when the pointer leaves the nav. With reduced motion it only fades.
 */
export function NavLinks({ links }: { links: readonly NavLink[] }) {
  const listRef = useRef<HTMLUListElement>(null);
  const [pill, setPill] = useState<{ left: number; width: number; visible: boolean } | null>(null);

  const moveTo = (link: HTMLElement) => {
    const list = listRef.current;
    if (!list) return;
    const listBox = list.getBoundingClientRect();
    const box = link.getBoundingClientRect();
    setPill({ left: box.left - listBox.left, width: box.width, visible: true });
  };
  const hide = () => setPill((current) => (current ? { ...current, visible: false } : current));
  const onBlur = (event: FocusEvent<HTMLUListElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) hide();
  };

  return (
    <ul ref={listRef} className="relative flex items-center gap-0.5" onMouseLeave={hide} onBlur={onBlur}>
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 rounded-full bg-violet-wash shadow-[inset_0_1px_0_#ffffff,0_6px_14px_-10px_rgb(91_63_214/0.6)] ring-1 ring-violet/15 transition-[left,width,opacity] duration-300 ease-out-soft motion-reduce:transition-opacity ${
          pill?.visible ? "opacity-100" : "opacity-0"
        }`}
        style={pill ? { left: pill.left, width: pill.width } : undefined}
      />
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            onMouseEnter={(event) => moveTo(event.currentTarget)}
            onFocus={(event) => moveTo(event.currentTarget)}
            className="relative block rounded-full px-3.5 py-2 text-[0.9375rem] text-ink-soft transition-colors duration-200 hover:text-violet-strong focus-visible:text-violet-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
