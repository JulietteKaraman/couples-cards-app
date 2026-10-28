-- Anonymous counts for 31 Touch Points (28 Oct 2026).
-- Juliette chose: what people WRITE stays on their phone, never stored here.
-- This table only counts what people DO: which day they finished, which
-- feeling colour they tapped, whether they did the free example day and
-- tapped through to buy. No user id, no email, no IP address, no free text.
create table if not exists public.anon_counts (
  id bigserial primary key,
  event text not null check (event in ('taster_open','taster_done','taster_feel','taster_buy_click','day_done','day_feel')),
  day smallint check (day between 0 and 31),
  feel text check (feel in ('laughed','close','awkward','flat')),
  created_at timestamptz not null default now()
);
-- Only the server (service role) writes or reads. Nobody else can.
alter table public.anon_counts enable row level security;
