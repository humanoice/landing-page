import "server-only";

/**
 * Telling the team what just happened, in Lark, through a custom bot's incoming
 * webhook (https://open.larksuite.com/document/client-docs/bot-v3/add-custom-bot).
 *
 * One-way and entirely best-effort. Nobody replies to these, the applicant is
 * never told one was sent, and every call site fires it from `after()` — a Lark
 * outage has to cost a seat nothing. For the same reason a missing
 * LARK_WEBHOOK_URL is a quiet no-op rather than the throw `resend()` does: the
 * confirmation email is a promise we made the applicant, this is a convenience
 * we made ourselves, and a preview deploy without the variable should still take
 * applications.
 */

/** The webhook is one POST to a service we don't control; don't hang a response on a slow one. */
const TIMEOUT_MS = 8_000;

/** Lark caps a message body at 20 KB. Form fields are bounded already; a model's `note` isn't. */
const MAX_VALUE = 500;

/**
 * One line of a notice: a label and whatever it says. `null` is a blank line.
 *
 * An empty value — a field they left alone, a list nothing was ticked in — drops
 * its row, so a message only ever shows what someone actually filled in.
 */
export type Row = readonly [label: string, value: unknown] | null;

/**
 * Post a notice. Never throws and never returns a failure: the caller has
 * nothing useful to do about one, so a bad send is logged here and that's it.
 *
 * Sent as rich text ("post") rather than an interactive card because every
 * segment of a post renders literally. Half of what goes in these messages was
 * typed by a stranger into a public form, and a card's `lark_md` would turn a
 * company of "[Payroll](https://phish.example)" into a live link in the team's
 * chat. Here it stays the text they typed.
 */
export async function notifyLark(title: string, rows: Row[]): Promise<void> {
  const url = process.env.LARK_WEBHOOK_URL;
  // Lark isn't wired up in this environment. Not an error — see the file comment.
  if (!url) return;

  const lines = render(rows);
  if (lines.length === 0) return;

  try {
    const body = { title, content: lines.map((text) => [{ tag: "text", text }]) };
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      // Both locale keys carry the same block: Lark shows the one matching the
      // reader's client language, and shows nothing at all when it finds none.
      body: JSON.stringify({ msg_type: "post", content: { post: { en_us: body, zh_cn: body } } }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    // A refused message still comes back 200 — the verdict is the body's `code`.
    const result = (await response.json().catch(() => null)) as { code?: number; msg?: string } | null;
    if (!response.ok || (result?.code ?? 0) !== 0) {
      throw new Error(`${response.status} · code ${result?.code ?? "?"} · ${result?.msg ?? "no body"}`);
    }
  } catch (error) {
    console.error("[lark] notify failed", { title }, error);
  }
}

/** Rows to the lines they print as, with the empty ones and their stray separators gone. */
function render(rows: Row[]): string[] {
  const lines: string[] = [];

  for (const row of rows) {
    if (row === null) {
      // A separator only earns its place between two lines that survived.
      if (lines.length > 0 && lines[lines.length - 1] !== "") lines.push("");
      continue;
    }
    const value = text(row[1]);
    if (value) lines.push(`${row[0]}: ${value}`);
  }

  while (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();
  return lines;
}

/** Whatever was handed in, as one line — empty when there was nothing to say. */
function text(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.map(text).filter(Boolean).join(", ");
  return String(value).trim().slice(0, MAX_VALUE);
}
