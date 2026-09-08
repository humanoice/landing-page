-- 0001 — payments: who is paying for which seats, and what their transfer slip said.
--
-- The first file in this folder: the earlier live changes (students.languages,
-- courses.limit_seat) predate it and already sit in db/schema.sql. Apply with the
-- DIRECT connection, then mirror the same definitions into db/schema.sql:
--   psql "$DATABASE_URL_UNPOOLED" -f db/migrations/0001_payments.sql

create table if not exists payments (
  -- Handed to the browser as the only key to the "upload your slip" step, so it
  -- has to be as unguessable as a student id.
  id               uuid        primary key default gen_random_uuid(),
  student_id       uuid        not null references students (id) on delete cascade,
  payer_type       text        not null check (payer_type in ('individual', 'company')),
  -- What goes on the receipt. Optional for an individual, required for a company —
  -- enforced by the form, not here, so a row the team types in by hand can be partial.
  receipt_name     text,                        -- individual: full legal name / company: registered name
  receipt_tax_id   text,                        -- individual: national ID     / company: tax ID
  receipt_address  text,
  price_thb        integer     not null,        -- the runs' price_thb summed, as it stood when they applied
  withholding_thb  numeric(10,2) not null default 0,   -- 3% a company deducts at source; 0 for an individual
  -- The slip has to show price_thb - withholding_thb.
  --
  -- Last verdict on an uploaded slip, verbatim from src/lib/slip.ts (SlipVerdict): ok, issue,
  -- and the transcription under `slip` — amount, reference, transferred_at, sender_name, bank.
  -- Overwritten on every attempt and kept on a failed one too, so whoever answers LINE can
  -- see what went wrong. The image itself is never stored.
  slip_reading     jsonb       check (slip_reading is null or jsonb_typeof(slip_reading) = 'object'),
  verified_at      timestamptz,                 -- when a slip was accepted; null = not paid yet
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists payments_student_id_idx on payments (student_id);

-- One slip pays for one seat: confirmPayment looks the transfer reference up across every
-- verified payment before accepting a new one. Without this that read scans the table.
create index if not exists payments_slip_reference_idx
  on payments (((slip_reading #>> '{slip,reference}')))
  where verified_at is not null;

-- Which transfer paid for this seat. One payment covers every unpaid run picked in one
-- submission (at most one per track), so the slip is recorded once, not once per seat.
alter table participations add column if not exists payment_id uuid references payments (id);

drop trigger if exists payments_set_updated_at on payments;
create trigger payments_set_updated_at
  before update on payments
  for each row execute function set_updated_at();
