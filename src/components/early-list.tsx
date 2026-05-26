"use client";

import { useState } from "react";

/**
 * Front-end-only early-list capture (no backend wired up yet).
 * Replace the submit handler with a real endpoint when ready.
 */
export function EarlyList() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="rounded-2xl border-[3px] border-ink bg-yellow-main p-5 font-display text-lg font-extrabold text-ink shadow-[6px_6px_0_0_var(--ink)]">
        ✦ You&apos;re on the list — see you in Q4 2026.
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (email.trim()) setDone(true);
      }}
      className="flex flex-col gap-3 sm:flex-row"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        aria-label="Email address"
        className="w-full rounded-full border-[3px] border-ink bg-cream px-5 py-3.5 font-mono text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-4 focus:ring-yellow-main/60"
      />
      <button
        type="submit"
        className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full border-[3px] border-ink bg-yellow-main px-7 py-3.5 font-mono text-sm font-bold uppercase tracking-[0.12em] text-ink shadow-[5px_5px_0_0_var(--ink)] transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0_0_var(--ink)] active:translate-x-0 active:translate-y-0 active:shadow-[3px_3px_0_0_var(--ink)]"
      >
        Notify me
        <span className="transition-transform duration-200 group-hover:translate-x-1">
          →
        </span>
      </button>
    </form>
  );
}
