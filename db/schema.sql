-- Humanoice — initial schema (v0)
--
-- Three tables:
--   courses        — scheduled runs of the tracks on the landing page: one row per run, with its start/end date-time
--   students       — people (one row per person, regardless of how many runs they join)
--   participations — which student attends which course run, and where they are in the process
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

create table if not exists participations (
  -- uuid: a certificate belongs to a participation (this student, this run), so this is the
  -- id that naturally goes in a public certificate URL — keep it non-enumerable too.
  id            uuid        primary key default gen_random_uuid(),
  student_id    uuid        not null references students (id) on delete cascade,  -- delete a student → their participations go too
  course_id     integer     not null references courses (id),                     -- a run with participants can't be deleted
  status        text        not null default 'applied'
                check (status in ('applied', 'confirmed', 'completed', 'cancelled')),
  paid_status   boolean     not null default false,   -- payment is its own fact, not a stage of `status`
  completed_at  timestamptz,                   -- set when this student finishes; null = no certificate yet
  notes         text,                          -- free-form, per enrollment: payment, special requests, etc.
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (student_id, course_id)               -- one row per student per course run (also indexes student_id lookups)
);

create index if not exists participations_course_id_idx on participations (course_id);

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
