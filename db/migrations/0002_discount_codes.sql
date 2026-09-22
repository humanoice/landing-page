-- 0002 — discount codes: a percentage off the fee, handed out by the owner, capped at N uses.
--
-- Apply with the DIRECT connection, then mirror the same definitions into db/schema.sql:
--   psql "$DATABASE_URL_UNPOOLED" -f db/migrations/0002_discount_codes.sql
--
-- There is no admin page: codes are typed in by hand, like courses.
--   insert into discount_codes (code, percent, max_uses, note) values ('SON-FRIENDS', 20, 5, 'friends, Oct cohort');
-- Uses left, per code:
--   select d.code, d.max_uses - count(p.id) as uses_left
--   from discount_codes d
--   left join payments p on p.discount_code_id = d.id and p.verified_at is not null
--   group by d.id;

create table if not exists discount_codes (
  id            integer generated always as identity primary key,
  code          text        not null unique check (code = upper(code)),   -- 'SON-FRIENDS'; the form upper-cases what's typed
  percent       smallint    not null check (percent between 1 and 100),    -- off the runs' summed price_thb, rounded to the baht
  max_uses      integer     not null check (max_uses > 0),
  -- A use is a VERIFIED payment carrying this code (payments.discount_code_id with
  -- verified_at set). An application that never pays holds nothing, so two people
  -- can apply with the last use and both pay — accepted, the team reconciles on LINE.
  is_active     boolean     not null default true,
  expires_at    timestamptz,                  -- null = never
  note          text,                         -- who it's for
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table payments
  add column if not exists discount_code_id integer references discount_codes (id),
  -- Whole baht taken off price_thb; net = price_thb - discount_thb, and withholding
  -- is 3% of that net. The slip has to show price_thb - discount_thb - withholding_thb.
  add column if not exists discount_thb     integer not null default 0 check (discount_thb >= 0);

-- The uses-left count reads this.
create index if not exists payments_discount_code_idx
  on payments (discount_code_id) where verified_at is not null;

drop trigger if exists discount_codes_set_updated_at on discount_codes;
create trigger discount_codes_set_updated_at
  before update on discount_codes
  for each row execute function set_updated_at();
