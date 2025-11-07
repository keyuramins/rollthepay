-- lib/db/schema.sql
-- PostgreSQL Schema for RollThePay
-- Single table design optimized for user contributions and high performance

CREATE TABLE occupations (
  -- Primary identification
  id SERIAL PRIMARY KEY,
  slug_url VARCHAR(500) NOT NULL,
  title TEXT NOT NULL,
  occ_name TEXT,
  company_name TEXT,

  
  -- Geographic hierarchy
  country VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  location VARCHAR(100),
  
  -- PRIMARY SALARY FIELDS (ALL USER-EDITABLE)
  -- These will be updated by website users in the future
  avg_annual_salary NUMERIC(12,2),
  avg_hourly_salary NUMERIC(12,2),
  hourly_low_value NUMERIC(12,2),
  hourly_high_value NUMERIC(12,2),
  fortnightly_salary NUMERIC(12,2),
  monthly_salary NUMERIC(12,2),
  total_pay_min NUMERIC(12,2),
  total_pay_max NUMERIC(12,2),
  
  -- ADDITIONAL COMPENSATION (USER-EDITABLE)
  bonus_range_min NUMERIC(12,2),
  bonus_range_max NUMERIC(12,2),
  profit_sharing_min NUMERIC(12,2),
  profit_sharing_max NUMERIC(12,2),
  commission_min NUMERIC(12,2),
  commission_max NUMERIC(12,2),
  
  -- Gender distribution (percentage)
  gender_male NUMERIC(5,2),
  gender_female NUMERIC(5,2),
  
  -- Experience level salaries (EDITABLE)
  entry_level NUMERIC(12,2),
  early_career NUMERIC(12,2),
  mid_career NUMERIC(12,2),
  experienced NUMERIC(12,2),
  late_career NUMERIC(12,2),
  
  -- Years of experience salaries (EDITABLE)
  one_yr NUMERIC(12,2),
  one_four_yrs NUMERIC(12,2),
  five_nine_yrs NUMERIC(12,2),
  ten_nineteen_yrs NUMERIC(12,2),
  twenty_yrs_plus NUMERIC(12,2),
  
  -- Salary percentiles (EDITABLE)
  percentile_10 NUMERIC(12,2),
  percentile_25 NUMERIC(12,2),
  percentile_50 NUMERIC(12,2),
  percentile_75 NUMERIC(12,2),
  percentile_90 NUMERIC(12,2),
  
  -- Skills (JSONB array of {name, percentage})
  skills JSONB DEFAULT '[]'::jsonb,
  
  -- Metadata for user contributions
  data_source VARCHAR(50) DEFAULT 'admin_import', -- 'admin_import' or 'user_contribution'
  contribution_count INTEGER DEFAULT 0, -- Track number of user updates
  last_verified_at TIMESTAMP, -- When data was last verified
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_occupation_path UNIQUE (country, state, location, slug_url)
);

-- Core performance indexes
CREATE INDEX idx_occupations_country ON occupations(country);
CREATE INDEX idx_occupations_country_state ON occupations(country, state) WHERE state IS NOT NULL;
CREATE INDEX idx_occupations_country_state_location ON occupations(country, state, location) WHERE location IS NOT NULL;
CREATE INDEX idx_occupations_slug ON occupations(slug_url);

-- Functional indexes for case-insensitive lookups (optimize LOWER(column) predicates)
CREATE INDEX IF NOT EXISTS idx_occupations_country_ci ON occupations ((LOWER(country)));
CREATE INDEX IF NOT EXISTS idx_occupations_state_ci ON occupations ((LOWER(state))) WHERE state IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_occupations_location_ci ON occupations ((LOWER(location))) WHERE location IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_occupations_country_state_ci ON occupations ((LOWER(country)), (LOWER(state))) WHERE state IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_occupations_country_state_location_ci ON occupations ((LOWER(country)), (LOWER(state)), (LOWER(location))) WHERE location IS NOT NULL;

CREATE INDEX idx_occupations_title_search ON occupations USING GIN (to_tsvector('english', occ_name));

-- Skills JSONB index
CREATE INDEX idx_occupations_skills ON occupations USING GIN (skills);

-- (Removed covering indexes; keep only if query plans require them.)

-- Partial indexes for non-null geographic levels
CREATE INDEX idx_occupations_state_not_null ON occupations(state) WHERE state IS NOT NULL;
CREATE INDEX idx_occupations_location_not_null ON occupations(location) WHERE location IS NOT NULL;

-- Indexes for user contributions tracking
CREATE INDEX idx_occupations_data_source ON occupations(data_source);
CREATE INDEX idx_occupations_last_verified ON occupations(last_verified_at) WHERE last_verified_at IS NOT NULL;

-- Indexes for salary-based queries
CREATE INDEX idx_occupations_avg_salary ON occupations(avg_annual_salary) WHERE avg_annual_salary IS NOT NULL;

-- Composite index for path-based lookups (most common query pattern)
CREATE UNIQUE INDEX idx_occupations_path_lookup ON occupations(country, state, location, slug_url);

-- Index for experience level queries
CREATE INDEX idx_occupations_experience_levels ON occupations(entry_level, early_career, mid_career, experienced, late_career) 
  WHERE entry_level IS NOT NULL OR early_career IS NOT NULL OR mid_career IS NOT NULL OR experienced IS NOT NULL OR late_career IS NOT NULL;

-- Materialized views for aggregations (refresh after user updates)
CREATE MATERIALIZED VIEW mv_country_stats AS
SELECT 
  country,
  COUNT(*) as job_count,
  AVG(avg_annual_salary) as avg_salary,
  COUNT(DISTINCT state) as state_count
FROM occupations
GROUP BY country;

CREATE INDEX idx_mv_country_stats_country ON mv_country_stats(country);

CREATE MATERIALIZED VIEW mv_state_stats AS
SELECT 
  country,
  state,
  COUNT(*) as job_count,
  AVG(avg_annual_salary) as avg_salary,
  COUNT(DISTINCT location) as location_count
FROM occupations
WHERE state IS NOT NULL
GROUP BY country, state;

CREATE INDEX idx_mv_state_stats_country_state ON mv_state_stats(country, state);

-- Trigger to update updated_at and track user contributions
CREATE OR REPLACE FUNCTION update_occupation_metadata()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  
  -- If salary fields changed, increment contribution_count
  IF (NEW.avg_annual_salary IS DISTINCT FROM OLD.avg_annual_salary) OR
     (NEW.avg_hourly_salary IS DISTINCT FROM OLD.avg_hourly_salary) THEN
    NEW.contribution_count = COALESCE(OLD.contribution_count, 0) + 1;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_occupations_metadata
BEFORE UPDATE ON occupations
FOR EACH ROW
EXECUTE FUNCTION update_occupation_metadata();
