-- When She Stops Reaching and The Full Stop in the app (2 Nov 2026). Anonymous counts only.
ALTER TABLE public.anon_counts DROP CONSTRAINT IF EXISTS anon_counts_event_check;
ALTER TABLE public.anon_counts ADD CONSTRAINT anon_counts_event_check
  CHECK (event IN ('taster_open','taster_done','taster_feel','taster_buy_click','day_done','day_feel','htflaw_solo','htflaw_lab','tm_taster_open','tm_taster_done','tm_taster_buy_click','tm_day_done','tm_vip_click','wssr_open','wssr_done','wssr_solo','fs_open','fs_day'));
