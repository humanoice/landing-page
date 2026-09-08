-- Humanoice — initial schema (v0)
--
-- Four tables:
--   courses        — scheduled runs of the tracks on the landing page: one row per run, with its start/end date-time
--   students       — people (one row per person, regardless of how many runs they join)
--   payments       — one bank transfer: who paid, what goes on the receipt, what the slip said
--   participations — which student attends which course run, and where they are in the process
--
-- The schema is deployed. `create table if not exists` no-ops on production, so every live
-- change is a db/migrations/NNNN_*.sql applied first, then mirrored here.
--
-- Apply with a DIRECT (non-pooled) connection, never the -pooler one:
--   psql "$DATABASE_URL_UNPOOLED" -f db/schema.sql
--   psql "$DATABASE_URL_UNPOOLED" -f db/seed.sql

create table if not exists courses (
  id            integer generated always as identity primary key,
  slug          text        not null,          -- 'hardware-101' — stable key, safe for URLs (not unique: a track can run many times)
  name          text        not null,          -- 'Hardware in Humanoid 101'
  track_no      smallint,                      -- 1 Hardware / 2 Software / 3 B2B
  start_time    timestamptz,                   -- when the run starts, e.g. '2026-10-02 09:00+07' (Bangkok); null = TBD
  end_time      timestamptz,                   -- when the run ends,   e.g. '2026-10-04 17:00+07'
  price_thb     integer,                       -- null = "talk to us" (B2B)
  limit_seat    smallint    check (limit_seat > 0),   -- max seats per run; null = no cap
  description   text,
  is_active     boolean     not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  check (end_time > start_time)                -- only enforced when both are set
);

create table if not exists students (
  -- uuid, not a serial: student ids may appear in public URLs, so they must not be
  -- guessable / enumerable.
  id            uuid        primary key default gen_random_uuid(),
  first_name    text        not null,
  last_name     text        not null,
  nickname      text,
  email         text,
  phone         text,
  line_id       text,        -- applications come in via LINE
  job_title     text,        -- e.g. 'Mechanical Engineer', 'Student'
  company       text,        -- employer / university; also useful for B2B cohorts
  languages     text[]      not null default '{}'   -- spoken: '{th}', '{en}', or '{th,en}' for both; '{}' = not answered
                check (languages <@ array['th', 'en']),   -- codes match src/lib/i18n.ts Locale
  -- Pre-course background survey, as key-value data so the questions can change without a
  -- migration. Expected keys today (all optional):
  --   robotics_years         number    e.g. 2
  --   programming_years      number    e.g. 5
  --   programming_languages  string[]  languages + tools, e.g. ["python", "linux"]
  --   skills                 string[]  e.g. ["electronics", "mechanics"]
  -- Query examples: (background->>'robotics_years')::int >= 2   |   background->'skills' ? 'electronics'
  background    jsonb       not null default '{}'
                check (jsonb_typeof(background) = 'object'),   -- must be an object, not an array/scalar
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

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

create table if not exists participations (
  -- uuid: a certificate belongs to a participation (this student, this run), so this is the
  -- id that naturally goes in a public certificate URL — keep it non-enumerable too.
  id            uuid        primary key default gen_random_uuid(),
  student_id    uuid        not null references students (id) on delete cascade,  -- delete a student → their participations go too
  course_id     integer     not null references courses (id),                     -- a run with participants can't be deleted
  status        text        not null default 'applied'
                check (status in ('applied', 'confirmed', 'completed', 'cancelled')),
  paid_status   boolean     not null default false,   -- payment is its own fact, not a stage of `status`
  payment_id    uuid        references payments (id),  -- the transfer that paid for this seat; one payment covers every run picked in one submission
  completed_at  timestamptz,                   -- set when this student finishes; null = no certificate yet
  notes         text,                          -- free-form, per enrollment: payment, special requests, etc.
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (student_id, course_id)               -- one row per student per course run (also indexes student_id lookups)
);

-- Email is a student's identity: /apply prefills a returning applicant's answers from
-- this row and updates it instead of adding another. lower() because people type
-- Ann@x.com one time and ann@x.com the next; nulls stay distinct, so the students who
-- came in via LINE with no email don't collide.
create unique index if not exists students_email_lower_idx on students (lower(email));

create index if not exists participations_course_id_idx on participations (course_id);

create index if not exists payments_student_id_idx on payments (student_id);

-- One slip pays for one seat: confirmPayment looks the transfer reference up across every
-- verified payment before accepting a new one. Without this that read scans the table.
create index if not exists payments_slip_reference_idx
  on payments (((slip_reading #>> '{slip,reference}')))
  where verified_at is not null;

-- Keep updated_at current on every UPDATE (Postgres has no ON UPDATE clause).
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists courses_set_updated_at on courses;
create trigger courses_set_updated_at
  before update on courses
  for each row execute function set_updated_at();

drop trigger if exists students_set_updated_at on students;
create trigger students_set_updated_at
  before update on students
  for each row execute function set_updated_at();

drop trigger if exists participations_set_updated_at on participations;
create trigger participations_set_updated_at
  before update on participations
  for each row execute function set_updated_at();

drop trigger if exists payments_set_updated_at on payments;
create trigger payments_set_updated_at
  before update on payments
  for each row execute function set_updated_at();
