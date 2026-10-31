/**
 * Hand-drawn line icons — 24×24, stroke 2.4, round caps, currentColor, no fills.
 * Draw new ones to the same spec; they always sit inside a bordered accent badge.
 */
const ICON_PROPS = {
  width: 28,
  height: 28,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function CodeIcon() {
  return (
    <svg {...ICON_PROPS} aria-hidden>
      <path d="m8 7-5 5 5 5" />
      <path d="m16 7 5 5-5 5" />
      <path d="m13.5 4-3 16" />
    </svg>
  );
}

export function AssembleIcon() {
  return (
    <svg {...ICON_PROPS} aria-hidden>
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.1-.6-.6-2.1z" />
      <circle cx="6.5" cy="17.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function WalkIcon() {
  return (
    <svg {...ICON_PROPS} aria-hidden>
      <circle cx="13.5" cy="4" r="1.8" />
      <path d="M12.8 6.6 11 12l2.6 2.2 1 6.2" />
      <path d="M12.1 10.4 8.6 12l-1.6 4.6" />
      <path d="M12.6 7.6l3.4 1.6 2.2-1.2" />
    </svg>
  );
}

/** Three bars — the mobile menu button. Sized for a 40px round button. */
export function MenuIcon() {
  return (
    <svg {...ICON_PROPS} width={18} height={18} aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
