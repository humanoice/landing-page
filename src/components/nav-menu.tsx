"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { MenuIcon } from "@/components/icons";

export type NavLinks = {
  education: { label: string; items: { label: string; hint: string; href: string }[] };
  about: { label: string; href: string };
};

const LINK =
  "group flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.18em] transition-colors hover:text-crimson";

/**
 * Close a popover on Escape or a press outside `ref`. Escape hands focus back to
 * the trigger so keyboard users aren't dropped at the top of the page.
 */
function useDismiss(
  open: boolean,
  close: () => void,
  ref: React.RefObject<HTMLElement | null>,
  trigger: React.RefObject<HTMLButtonElement | null>,
) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      close();
      trigger.current?.focus();
    };
    const onPointer = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, close, ref, trigger]);
}

/** Desktop links: "01 Education ▾" with its segment dropdown, then "02 About us". */
export function DesktopNav({ links }: { links: NavLinks }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLLIElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, close, wrapper, trigger);

  const inEducation = links.education.items.some((item) => item.href === pathname);
  const onAbout = links.about.href === pathname;

  return (
    <ul className="hidden items-center gap-7 md:flex">
      <li
        ref={wrapper}
        className="relative"
        onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
      >
        <button
          ref={trigger}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          className={`${LINK} ${inEducation ? "text-crimson" : "text-ink/70"}`}
        >
          <span className="text-crimson/50 group-hover:text-crimson">01</span>
          {links.education.label}
          <span
            aria-hidden
            className={`text-[10px] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          >
            ▾
          </span>
        </button>

        {/* pt-4 bridges the gap so the pointer can travel from button to panel */}
        <div
          id={panelId}
          hidden={!open}
          className="absolute left-1/2 top-full z-50 w-80 -translate-x-1/2 pt-4"
        >
          <ul className="rounded-2xl border-2 border-ink bg-white p-2 shadow-[4px_4px_0_0_var(--ink)]">
            {links.education.items.map((item, i) => {
              const current = item.href === pathname;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-current={current ? "page" : undefined}
                    className={`flex gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-cream-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                      current ? "bg-cream-deep" : ""
                    }`}
                  >
                    <span className="pt-0.5 font-mono text-[11px] font-bold tracking-[0.18em] text-crimson/60">
                      0{i + 1}
                    </span>
                    <span>
                      <span className="block font-display text-sm font-extrabold uppercase tracking-tight text-ink">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-[13px] leading-snug text-ink/60">
                        {item.hint}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </li>
      <li>
        <Link
          href={links.about.href}
          aria-current={onAbout ? "page" : undefined}
          className={`${LINK} ${onAbout ? "text-crimson" : "text-ink/70"}`}
        >
          <span className="text-crimson/50 group-hover:text-crimson">02</span>
          {links.about.label}
        </Link>
      </li>
    </ul>
  );
}

type MobileNavProps = {
  links: NavLinks;
  label: string;
  /** The language switcher — it moves in here below md, where the bar has no room for it. */
  children: ReactNode;
};

/** Below md: a round menu button that drops a full-width panel under the navbar. */
export function MobileNav({ links, label, children }: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, close, wrapper, trigger);

  const item =
    "block py-2.5 font-display text-lg font-extrabold uppercase tracking-tight transition-colors hover:text-crimson";

  return (
    <div ref={wrapper} className="md:hidden">
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={label}
        onClick={() => setOpen((o) => !o)}
        className={`grid size-10 place-items-center rounded-full border-2 border-ink text-ink shadow-[2px_2px_0_0_var(--ink)] transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
          open ? "bg-yellow-main" : "bg-white"
        }`}
      >
        <MenuIcon />
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full border-b-2 border-ink bg-cream px-5 pb-7 pt-5 sm:px-8"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60">
          <span className="text-crimson/60">01</span> {links.education.label}
        </p>
        <ul className="mt-1 border-b-2 border-dashed border-ink/15 pb-3">
          {links.education.items.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={close}
                aria-current={link.href === pathname ? "page" : undefined}
                className={`${item} ${link.href === pathname ? "text-crimson" : "text-ink"}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href={links.about.href}
          onClick={close}
          aria-current={links.about.href === pathname ? "page" : undefined}
          className={`mt-3 ${item} ${links.about.href === pathname ? "text-crimson" : "text-ink"}`}
        >
          <span className="mr-2 font-mono text-[11px] font-normal tracking-[0.18em] text-crimson/60">
            02
          </span>
          {links.about.label}
        </Link>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}
