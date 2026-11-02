-- Funnel 2 bites in the app, on top of the men's funnel bites (2 Nov 2026). Anonymous counts only.
ALTER TABLE public.anon_counts DROP CONSTRAINT IF EXISTS anon_counts_event_check;
ALTER TABLE public.anon_counts ADD CONSTRAINT anon_counts_event_check
  CHECK (event IN ('taster_open','taster_done','taster_feel','taster_buy_click','day_done','day_feel','htflaw_solo','htflaw_lab','tm_taster_open','tm_taster_done','tm_taster_buy_click','tm_day_done','tm_vip_click','wssr_open','wssr_done','wssr_solo','fs_open','fs_day','trace_open','trace_done','fifteen_open','fifteen_done','ritual_open','ritual_done','answers_open','answers_done','closer_open','closer_done','repair_open','repair_done'));
