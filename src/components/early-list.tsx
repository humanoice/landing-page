"use client";

import { useState, type FormEvent } from "react";

const fieldClass =
  "w-full rounded-full border-[3px] border-ink bg-cream px-5 py-3.5 font-mono text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-4 focus:ring-yellow-main/60";

type Status = "idle" | "loading" | "error" | "done";

/**
 * Early-list capture wired up to the Airtable-backed `/api/early-list` route,
 * which creates an "Inquiries" record with Name / Line ID / Phone.
 */
export function EarlyList() {
  const [name, setName] = useState("");
  const [lineId, setLineId] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  if (status === "done") {
    return (
      <div className="rounded-2xl border-[3px] border-ink bg-yellow-main p-5 font-display text-lg font-extrabold text-ink shadow-[6px_6px_0_0_var(--ink)]">
        ✦ You&apos;re on the list — see you in Q4 2026.
      </div>
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/early-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, lineId, phone }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  }

  const loading = status === "loading";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        aria-label="Name"
        autoComplete="name"
        disabled={loading}
        className={fieldClass}
      />
      <input
        type="text"
        required
        value={lineId}
        onChange={(e) => setLineId(e.target.value)}
        placeholder="Line ID"
        aria-label="Line ID"
        disabled={loading}
        className={fieldClass}
      />
      <input
        type="tel"
        required
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone"
        aria-label="Phone"
        autoComplete="tel"
        disabled={loading}
        className={fieldClass}
      />

      {status === "error" && (
        <p className="font-mono text-sm font-bold text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full border-[3px] border-ink bg-yellow-main px-7 py-3.5 font-mono text-sm font-bold uppercase tracking-[0.12em] text-ink shadow-[5px_5px_0_0_var(--ink)] transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0_0_var(--ink)] active:translate-x-0 active:translate-y-0 active:shadow-[3px_3px_0_0_var(--ink)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[5px_5px_0_0_var(--ink)]"
      >
        {loading ? "Sending…" : "Notify me"}
        {!loading && (
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        )}
      </button>
    </form>
  );
}
