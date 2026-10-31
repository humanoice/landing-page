"use client";

import { useEffect, useRef } from "react";

type CursorCircleProps = {
  /** Position and size of the circle's resting place, e.g. `-left-16 top-24 size-56`. */
  className: string;
};

/** How much of the remaining distance the circle covers each frame — lower trails lazier. */
const EASE = 0.1;

/**
 * The hero's outlined circle, which trails the mouse across its parent section
 * and drifts home when the pointer leaves. The outer layer follows; the inner
 * layer keeps its `.float` bob, so the two transforms never fight.
 * Mouse only, and it stays put under `prefers-reduced-motion`.
 */
export function CursorCircle({ className }: CursorCircleProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const area = el?.parentElement;
    if (!el || !area) return;
    if (
      !matchMedia("(hover: hover) and (pointer: fine)").matches ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let frame = 0;

    const tick = () => {
      pos.x += (target.x - pos.x) * EASE;
      pos.y += (target.y - pos.y) * EASE;
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      const settled = Math.abs(target.x - pos.x) < 0.1 && Math.abs(target.y - pos.y) < 0.1;
      frame = settled ? 0 : requestAnimationFrame(tick);
    };
    const run = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    // offsetLeft/Top ignore transforms, so they always measure the resting spot.
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const box = area.getBoundingClientRect();
      target.x = e.clientX - box.left - (el.offsetLeft + el.offsetWidth / 2);
      target.y = e.clientY - box.top - (el.offsetTop + el.offsetHeight / 2);
      run();
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
      run();
    };

    area.addEventListener("pointermove", onMove);
    area.addEventListener("pointerleave", onLeave);
    return () => {
      area.removeEventListener("pointermove", onMove);
      area.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute will-change-transform ${className}`}
    >
      <div className="float size-full rounded-full border-2 border-yellow-main/25" />
    </div>
  );
}
