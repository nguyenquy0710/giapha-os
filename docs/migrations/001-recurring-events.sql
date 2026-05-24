-- Migration: Add recurring event support to custom_events
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/YOUR-PROJECT/sql)

-- Add recurrence columns (IF NOT EXISTS prevents errors if already present)
ALTER TABLE custom_events
  ADD COLUMN IF NOT EXISTS frequency TEXT DEFAULT 'single',
  ADD COLUMN IF NOT EXISTS lunar_day INTEGER,
  ADD COLUMN IF NOT EXISTS offset_days INTEGER,
  ADD COLUMN IF NOT EXISTS last_used_lunar_month INTEGER;

-- Add check constraints (separate from column creation for IF NOT EXISTS compatibility)
DO $$ BEGIN
  -- frequency must be 'single' or 'yearly_lunar'
  IF NOT EXISTS (SELECT 1 FROM information_schema.constraint_column_usage 
                 WHERE constraint_name = 'custom_events_frequency_check') THEN
    ALTER TABLE custom_events ADD CONSTRAINT custom_events_frequency_check 
      CHECK (frequency IN ('single', 'yearly_lunar'));
  END IF;
  
  -- lunar_day: 1-30
  IF NOT EXISTS (SELECT 1 FROM information_schema.constraint_column_usage 
                 WHERE constraint_name = 'custom_events_lunar_day_check') THEN
    ALTER TABLE custom_events ADD CONSTRAINT custom_events_lunar_day_check 
      CHECK (lunar_day IS NULL OR (lunar_day BETWEEN 1 AND 30));
  END IF;
  
  -- offset_days: -15 to 15
  IF NOT EXISTS (SELECT 1 FROM information_schema.constraint_column_usage 
                 WHERE constraint_name = 'custom_events_offset_days_check') THEN
    ALTER TABLE custom_events ADD CONSTRAINT custom_events_offset_days_check 
      CHECK (offset_days IS NULL OR (offset_days BETWEEN -15 AND 15));
  END IF;
  
  -- last_used_lunar_month: 1-12
  IF NOT EXISTS (SELECT 1 FROM information_schema.constraint_column_usage 
                 WHERE constraint_name = 'custom_events_last_used_lunar_month_check') THEN
    ALTER TABLE custom_events ADD CONSTRAINT custom_events_last_used_lunar_month_check 
      CHECK (last_used_lunar_month IS NULL OR (last_used_lunar_month BETWEEN 1 AND 12));
  END IF;
END $$;

-- Index for recurring event queries
CREATE INDEX IF NOT EXISTS idx_custom_events_frequency_lunar_day 
  ON public.custom_events(frequency, lunar_day) 
  WHERE frequency = 'yearly_lunar';
