ALTER TABLE public.dramas
  ADD COLUMN IF NOT EXISTS second_lead_actor_id integer,
  ADD COLUMN IF NOT EXISTS release_year integer;