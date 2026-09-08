"use client";

import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import {
  Arrow,
  BusyNote,
  CTA,
  CTA_BUSY,
  ERROR,
  LineCta,
  META,
  OutcomePanel,
  PILL,
  Section,
} from "@/components/apply-ui";
import { track, TrackedAnchor } from "@/components/track";
import {
  confirmPayment,
  type Confirmation,
  type PaymentSummary,
  type PayState,
} from "@/app/apply/actions";
import type { RunSummary } from "@/lib/courses";
import type { ApplyCopy, Locale } from "@/lib/i18n";
import { amountDue, BANK, formatThb } from "@/lib/payment";
import { siteConfig } from "@/lib/site";
import { ACCEPTED_IMAGE_TYPES, type SlipIssue } from "@/lib/slip-types";

type PaymentPanelProps = {
  payment: PaymentSummary;
  copy: ApplyCopy;
  locale: Locale;
};

const INITIAL: PayState = { status: "idle" };

/**
 * Step 2 of applying: what to transfer, where, and the slip that proves it.
 * Takes over the page from the form once the application is saved and priced.
 */
export function PaymentPanel({ payment, copy, locale }: PaymentPanelProps) {
  const [state, formAction, pending] = useActionState(confirmPayment, INITIAL);
  const dueThb = amountDue(payment.priceThb, payment.withholdingThb);

  // They've committed to paying — the step GA calls checkout.
  useEffect(() => {
    track("begin_checkout", { value: dueThb, currency: "THB" });
  }, [dueThb]);

  if (state.status === "paid") {
    return <PaidPanel confirmation={state.confirmation} copy={copy.paid} directions={copy.directions} />;
  }

  const pay = copy.pay;
  const unit = copy.course.priceUnit;

  return (
    <div className="space-y-10">
      <header className="pop-in" style={{ "--rot": "0deg" } as React.CSSProperties}>
        <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-crimson">
          <span className="inline-block h-px w-8 bg-crimson" />
          {pay.eyebrow}
        </p>
        <h2 className="mt-4 font-display text-[clamp(1.8rem,5vw,2.8rem)] font-black uppercase leading-[0.95] tracking-tight">
          {pay.title} <span className="text-crimson">{pay.highlight}</span>
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/70">{pay.intro}</p>
      </header>

      {/* React sets the multipart encoding itself for a function action — spelling it out only earns a warning. */}
      <form action={formAction} noValidate className="space-y-10">
        <input type="hidden" name="paymentId" value={payment.id} />
        <input type="hidden" name="locale" value={locale} />

        {/* ---------- 05 · Transfer ---------- */}
        <Section n="05" title={pay.amount} shadow="var(--yellow-main)">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
            <p className="font-display text-[clamp(2.2rem,7vw,3.4rem)] font-black leading-none tracking-tight text-crimson">
              {formatThb(dueThb)}
              <span className="ml-2 font-mono text-base font-bold tracking-[0.12em] text-ink/60">{unit}</span>
            </p>
            {payment.withholdingThb > 0 && (
              <p className="font-mono text-[11px] leading-relaxed text-ink/55">
                {formatThb(payment.priceThb)} − {formatThb(payment.withholdingThb)} {unit}
                <br />
                {pay.withholdingNote}
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-4 rounded-2xl border-2 border-ink bg-cream p-4 shadow-[4px_4px_0_0_var(--ink)] sm:flex-row sm:items-center sm:gap-5 sm:p-5">
            <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl border-2 border-ink bg-white">
              <Image src={BANK.logo} alt={pay.bank} width={56} height={56} className="size-12 object-contain" />
            </span>
            <dl className="min-w-0 flex-1 space-y-2.5">
              <div>
                <dt className={`${META} text-ink/45`}>{pay.bank}</dt>
                <dd className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <span className="font-display text-xl font-extrabold tracking-tight sm:text-2xl">
                    {BANK.account}
                  </span>
                  <CopyButton value={BANK.account} label={pay.copy} done={pay.copied} />
                </dd>
              </div>
              <div>
                <dt className={`${META} text-ink/45`}>{pay.accountName}</dt>
                <dd className="mt-0.5 text-base font-semibold">{BANK.holder}</dd>
              </div>
            </dl>
          </div>

          <p className={`${META} mb-2.5 mt-6 flex items-center gap-3 text-ink/45`}>
            {pay.runs}
            <span aria-hidden className="h-0.5 flex-1 bg-ink/10" />
          </p>
          <RunList runs={payment.runs} />
        </Section>

        {/* ---------- 06 · The slip ---------- */}
        <Section n="06" title={pay.slip} hint={pay.slipHint} shadow="var(--orange-secondary)">
          <SlipField copy={pay} error={state.status === "error" ? pay.errors[state.error] : undefined} />
        </Section>

        {state.status === "rejected" && (
          <RejectedNote issue={state.issue} copy={pay.rejected} qrLabel={copy.paid.qrLabel} />
        )}

        <div className="flex flex-wrap items-center gap-5">
          <button
            type="submit"
            disabled={pending}
            onClick={() => track("slip_submit")}
            className={`${CTA} ${CTA_BUSY}`}
          >
            {pending ? pay.submitting : pay.submit}
            <Arrow />
          </button>
          {pending && <BusyNote>{pay.submitting}</BusyNote>}
        </div>
      </form>
    </div>
  );
}

/* ---------- Pieces ---------- */

type RunListProps = {
  runs: (RunSummary & { calendarUrl?: string })[];
  calendarLabel?: string;
  /** Inside the crimson panels the cards go light-on-dark. */
  tone?: "light" | "dark";
};

function RunList({ runs, calendarLabel, tone = "light" }: RunListProps) {
  const dark = tone === "dark";

  return (
    <ul className="space-y-2.5">
      {runs.map((run) => (
        <li
          key={run.name + run.dates}
          className={`rounded-xl border-2 p-3 sm:px-4 ${
            dark ? "border-cream/30 bg-cream/10 text-cream" : "border-ink bg-white"
          }`}
        >
          <p
            className={`font-mono text-[11px] font-bold uppercase tracking-[0.14em] ${
              dark ? "text-yellow-main" : "text-crimson"
            }`}
          >
            {run.dates} · {run.hours}
          </p>
          <p className="mt-1 font-display text-sm font-extrabold uppercase leading-tight tracking-tight sm:text-base">
            {run.name}
          </p>
          {run.calendarUrl && calendarLabel && (
            <TrackedAnchor
              event="calendar_click"
              href={run.calendarUrl}
              target="_blank"
              rel="noreferrer"
              className={`mt-2.5 inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] transition-all duration-150 hover:-translate-y-0.5 ${
                dark
                  ? "border-cream/40 text-cream hover:border-yellow-main hover:text-yellow-main"
                  : "border-ink bg-white text-ink shadow-[2px_2px_0_0_var(--ink)]"
              }`}
            >
              {calendarLabel} <span aria-hidden>↗</span>
            </TrackedAnchor>
          )}
        </li>
      ))}
    </ul>
  );
}

type CopyButtonProps = { value: string; label: string; done: string };

function CopyButton({ value, label, done }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
        } catch {
          // No clipboard (http, old WebView): the number is right there to select.
        }
      }}
      className={`${PILL} px-3 py-1 text-[10px]`}
    >
      {copied ? done : label}
    </button>
  );
}

type SlipFieldProps = { copy: ApplyCopy["pay"]; error?: string };

/** The picked file and the object URL that previews it — made together, released together. */
type Picked = { file: File; url: string };

function SlipField({ copy, error }: SlipFieldProps) {
  const [picked, setPicked] = useState<Picked | null>(null);

  // Release each preview URL when it's replaced, and the last one when the panel goes away.
  useEffect(() => {
    if (!picked) return;
    return () => URL.revokeObjectURL(picked.url);
  }, [picked]);

  const id = "apply-slip";
  const file = picked?.file ?? null;
  const preview = picked?.url ?? null;

  return (
    <div>
      <div
        className={`flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed p-5 text-center transition-colors ${
          error ? "border-crimson bg-crimson/5" : preview ? "border-ink bg-cream" : "border-ink/30 bg-cream/60"
        }`}
      >
        {preview ? (
          // A blob: URL from the file they just picked — nothing for next/image to optimise.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="max-h-72 rounded-xl border-2 border-ink shadow-[3px_3px_0_0_var(--ink)]" />
        ) : (
          <span aria-hidden className="grid size-14 place-items-center rounded-xl border-2 border-ink/25 font-mono text-xl text-ink/40">
            ⇪
          </span>
        )}
        <label htmlFor={id} className={`${CTA} cursor-pointer px-6 py-3 text-xs shadow-[4px_4px_0_0_var(--ink)]`}>
          {file ? copy.change : copy.choose}
          <input
            id={id}
            type="file"
            name="slip"
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            onChange={(event) => {
              const next = event.target.files?.[0] ?? null;
              setPicked(next ? { file: next, url: URL.createObjectURL(next) } : null);
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            className="sr-only"
          />
        </label>
        {file && <p className="max-w-full truncate font-mono text-[11px] text-ink/55">{file.name}</p>}
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className={ERROR}>
          {error}
        </p>
      )}
    </div>
  );
}

type RejectedNoteProps = { issue: SlipIssue; copy: ApplyCopy["pay"]["rejected"]; qrLabel: string };

/**
 * Says what didn't add up and where a person can fix it. Sits above the form,
 * which stays put — a bad crop deserves a second go without starting over.
 */
function RejectedNote({ issue, copy, qrLabel }: RejectedNoteProps) {
  return (
    <OutcomePanel
      compact
      eyebrow={copy.eyebrow}
      title={copy.title}
      highlight={`${copy.highlight} 🙅🙅🙅`}
      qrLocation="apply_slip_rejected_qr"
      qrLabel={qrLabel}
    >
      <p className="mt-4 max-w-md font-semibold leading-relaxed">{copy.issues[issue]}</p>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-cream/80">{copy.body}</p>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <LineCta small location="apply_slip_rejected" label={copy.line} />
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-cream/70">{copy.retry}</span>
      </div>
    </OutcomePanel>
  );
}

type PaidPanelProps = {
  confirmation: Confirmation;
  copy: ApplyCopy["paid"];
  directions: ApplyCopy["directions"];
};

/** The end of the road: paid, invited, and pointed at LINE for everything after. */
function PaidPanel({ confirmation, copy, directions }: PaidPanelProps) {
  // The conversion. Fires on mount because this panel only renders once the
  // server has marked the seats paid.
  useEffect(() => {
    track("purchase", { value: confirmation.amountThb, currency: "THB" });
  }, [confirmation.amountThb]);

  return (
    <OutcomePanel
      eyebrow={copy.eyebrow}
      title={copy.title}
      highlight={copy.highlight}
      qrLocation="apply_paid_qr"
      qrLabel={copy.qrLabel}
    >
      <p className="mt-5 max-w-md leading-relaxed text-cream/80">
        {copy.body[0]} <strong className="font-semibold text-cream">{confirmation.email}</strong> {copy.body[1]}
      </p>

      <p className={`${META} mb-2.5 mt-8 flex items-center gap-3 text-yellow-main`}>
        {copy.runs}
        <span aria-hidden className="h-0.5 flex-1 bg-cream/20" />
      </p>
      <RunList runs={confirmation.runs} calendarLabel={copy.calendar} tone="dark" />

      <p className={`${META} mb-2 mt-7 text-yellow-main`}>{copy.where}</p>
      <p className="font-semibold">{siteConfig.venue.label}</p>
      <p className="mt-1 text-sm text-cream/80">
        <TrackedAnchor
          event="map_click"
          params={{ location: "apply_paid" }}
          href={siteConfig.venue.mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="underline decoration-yellow-main decoration-2 underline-offset-4 hover:text-yellow-main"
        >
          {copy.map} ↗
        </TrackedAnchor>
      </p>

      {/* Same words as the email and the invite, so nobody gets two versions of the way in. */}
      <p className={`${META} mb-2 mt-7 text-yellow-main`}>{directions.title}</p>
      <ol className="list-decimal space-y-1 pl-5 text-sm text-cream/90">
        {directions.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <div className="mt-3 max-w-md space-y-2 text-sm leading-relaxed text-cream/80">
        <p>{directions.landmark}</p>
        <p>{directions.laptop}</p>
        <p className="font-semibold text-cream">{directions.onTime}</p>
        <p>{directions.questions}</p>
      </div>

      <div className="mt-8">
        <LineCta location="apply_paid" label={copy.line} />
      </div>
    </OutcomePanel>
  );
}
