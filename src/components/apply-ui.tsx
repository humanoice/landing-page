"use client";

import Image from "next/image";
import { TrackedAnchor } from "@/components/track";
import { siteConfig } from "@/lib/site";

/**
 * The pieces the application form and the payment step share: the field and
 * button styles, a numbered section card, a controlled text field, the outcome
 * panel every ending renders in, and the LINE tiles. Nothing here knows what the
 * form is for.
 */

export const LABEL =
  "mb-2 flex items-baseline gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink/70";
export const INPUT =
  "w-full rounded-xl border-2 border-ink bg-white px-4 py-3 text-base text-ink shadow-[3px_3px_0_0_var(--ink)] outline-none transition-all duration-200 placeholder:text-ink/30 focus-visible:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-yellow-main/60 aria-invalid:border-crimson aria-invalid:shadow-[3px_3px_0_0_var(--red)]";
export const ERROR = "mt-2 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-crimson";
export const CHIP =
  "inline-flex cursor-pointer select-none items-center rounded-full border-2 border-ink bg-white px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-ink shadow-[2px_2px_0_0_var(--ink)] transition-all duration-150 hover:-translate-y-0.5 has-[:checked]:bg-ink has-[:checked]:text-yellow-main has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-yellow-main/60";
export const CTA =
  "group inline-flex items-center gap-2 rounded-full border-2 border-ink bg-yellow-main px-7 py-3.5 font-mono text-sm font-bold uppercase tracking-[0.12em] text-ink shadow-[5px_5px_0_0_var(--ink)] transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[9px_9px_0_0_var(--ink)] active:translate-x-0 active:translate-y-0 active:shadow-[3px_3px_0_0_var(--ink)]";
/** CTA while its action runs: still, dimmed, and not pretending to be clickable. */
export const CTA_BUSY =
  "disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[5px_5px_0_0_var(--ink)]";
/** CTA inset in a card, where the full-size one would crowd the box. */
export const CTA_SMALL = "px-6 py-3 text-xs shadow-[4px_4px_0_0_var(--ink)]";
/** The spec-sheet caption over a group of things. Pair it with a text colour. */
export const META = "font-mono text-[10px] font-bold uppercase tracking-[0.18em]";
/** A small outlined action that sits inside a field or a card: copy, fill, clear. */
export const PILL =
  "shrink-0 rounded-full border-2 border-ink bg-white px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-ink shadow-[2px_2px_0_0_var(--ink)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

/** The nudge on every CTA. */
export function Arrow() {
  return <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>;
}

/** "Checking…" — a pulsing dot and a line of mono caps, announced as it changes. */
export function BusyNote({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      aria-live="polite"
      className={`flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-ink/45 ${className}`}
    >
      <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-ink/50" />
      {children}
    </p>
  );
}

type SectionProps = {
  n: string;
  title: string;
  hint?: string;
  shadow: string;
  children: React.ReactNode;
};

export function Section({ n, title, hint, shadow, children }: SectionProps) {
  return (
    <section
      className="rounded-3xl border-[3px] border-ink bg-white p-6 shadow-[8px_8px_0_0_var(--shadow)] sm:p-8"
      style={{ "--shadow": shadow } as React.CSSProperties}
    >
      <div className="mb-7 flex items-center gap-3.5">
        <span
          className="grid size-10 shrink-0 place-items-center rounded-xl border-2 border-ink font-mono text-sm font-bold text-ink"
          style={{ background: shadow }}
        >
          {n}
        </span>
        <div>
          <h2 className="font-display text-lg font-extrabold uppercase leading-tight tracking-tight sm:text-xl">
            {title}
          </h2>
          {hint && <p className="mt-1 text-sm text-ink/55">{hint}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

type TextFieldProps<N extends string> = {
  name: N;
  label: string;
  optional?: string;
  error?: string;
  /** Controlled, so a lookup can drop someone's saved answers straight into the form. */
  value: string;
  onValueChange: (name: N, value: string) => void;
  /** A textarea instead of an input — for an address. */
  multiline?: boolean;
} & Pick<
  React.ComponentProps<"input">,
  "type" | "autoComplete" | "inputMode" | "placeholder" | "min" | "max" | "step"
>;

export function TextField<N extends string>({
  name,
  label,
  optional,
  error,
  value,
  onValueChange,
  multiline,
  ...input
}: TextFieldProps<N>) {
  const id = `apply-${name}`;
  const shared = {
    id,
    name,
    className: INPUT,
    value,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onValueChange(name, event.target.value),
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
  };
  return (
    <div>
      <label htmlFor={id} className={LABEL}>
        {label}
        {optional && (
          <span className="font-normal normal-case tracking-normal text-ink/40">({optional})</span>
        )}
      </label>
      {multiline ? (
        <textarea
          {...shared}
          rows={2}
          autoComplete={input.autoComplete}
          placeholder={input.placeholder}
          className={`${INPUT} resize-y`}
        />
      ) : (
        <input {...shared} {...input} />
      )}
      {error && (
        <p id={`${id}-error`} className={ERROR}>
          {error}
        </p>
      )}
    </div>
  );
}

type OutcomePanelProps = {
  eyebrow: string;
  title: string;
  highlight: string;
  /** GA `line_click` location for the QR tile, e.g. "apply_paid_qr". */
  qrLocation: string;
  qrLabel: string;
  /**
   * A rejection sits above a form the applicant is meant to use again, so it
   * runs a notch smaller — and it interrupts, where an ending merely announces.
   */
  compact?: boolean;
  children: React.ReactNode;
};

/**
 * Where every ending lands: the crimson card with the QR beside it. Three of
 * them — application received, slip rejected, seat confirmed — and the only
 * thing that changes between them is what goes under the headline.
 */
export function OutcomePanel({
  eyebrow,
  title,
  highlight,
  qrLocation,
  qrLabel,
  compact,
  children,
}: OutcomePanelProps) {
  return (
    <section
      role={compact ? "alert" : undefined}
      aria-live={compact ? undefined : "polite"}
      className={`pop-in rounded-3xl border-[3px] border-ink bg-crimson text-cream ${
        compact
          ? "p-6 shadow-[8px_8px_0_0_var(--yellow-main)] sm:p-8"
          : "p-7 shadow-[10px_10px_0_0_var(--yellow-main)] sm:p-10"
      }`}
      style={{ "--rot": "0deg" } as React.CSSProperties}
    >
      <div
        className={`grid sm:grid-cols-[1fr_auto] sm:items-start ${compact ? "gap-6 sm:gap-8" : "gap-8 sm:gap-10"}`}
      >
        <div className="min-w-0">
          <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-yellow-main">
            <span className="inline-block h-px w-8 bg-yellow-main" />
            {eyebrow}
          </p>
          {/* Sized for the longest headline any locale hands it, which has to clear the QR tile. */}
          <h2
            className={`font-display font-black uppercase leading-[0.95] tracking-tight ${
              compact ? "mt-4 text-[clamp(1.6rem,5vw,2.4rem)]" : "mt-5 text-[clamp(1.8rem,5.5vw,3rem)]"
            }`}
          >
            {title}
            {compact ? " " : <br />}
            <span className="text-yellow-main">{highlight}</span>
          </h2>
          {children}
        </div>
        <LineQr location={qrLocation} label={qrLabel} />
      </div>
    </section>
  );
}

type LineCtaProps = {
  /** GA `line_click` location, e.g. "apply_paid" */
  location: string;
  label: string;
  /** The inset size, for a CTA inside a card. */
  small?: boolean;
  className?: string;
};

/** "Add us on LINE" — the way out of every dead end in this flow. */
export function LineCta({ location, label, small, className = "" }: LineCtaProps) {
  return (
    <TrackedAnchor
      event="line_click"
      params={{ location }}
      href={siteConfig.lineAddUrl}
      target="_blank"
      rel="noreferrer"
      className={`${CTA} ${small ? CTA_SMALL : ""} ${className}`}
    >
      {label}
      <Arrow />
    </TrackedAnchor>
  );
}

type LineQrProps = {
  /** GA `line_click` location, e.g. "apply_success_qr" */
  location: string;
  label: string;
};

/** Same QR as the footer — on desktop it's the fastest way to add us. */
export function LineQr({ location, label }: LineQrProps) {
  return (
    <TrackedAnchor
      event="line_click"
      params={{ location }}
      href={siteConfig.lineAddUrl}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="block shrink-0 justify-self-start rounded-[1.35rem] bg-cream p-3 shadow-[6px_6px_0_0_var(--ink)] transition-transform duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[9px_9px_0_0_var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-main sm:justify-self-end"
    >
      <Image
        src={siteConfig.lineQrUrl}
        alt={label}
        width={200}
        height={200}
        sizes="(max-width: 639px) 150px, 180px"
        className="size-[150px] rounded-xl sm:size-[180px]"
      />
    </TrackedAnchor>
  );
}
