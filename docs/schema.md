Table "public.occupations"
Column       |            Type             | Collation | Nullable |                 Default                 | Storage  | Compression | Stats target | Description 
--------------------+-----------------------------+-----------+----------+-----------------------------------------+----------+-------------+--------------+-------------
id                 | integer                     |           | not null | nextval('occupations_id_seq'::regclass) | plain    |             |              | 
slug_url           | character varying(500)      |           | not null |                                         | extended |             |              | 
title              | text                        |           | not null |                                         | extended |             |              | 
occ_name           | text                        |           |          |                                         | extended |             |              | 
country            | character varying(100)      |           | not null |                                         | extended |             |              | 
state              | character varying(100)      |           |          |                                         | extended |             |              | 
location           | character varying(100)      |           |          |                                         | extended |             |              | 
avg_annual_salary  | numeric(12,2)               |           |          |                                         | main     |             |              | 
avg_hourly_salary  | numeric(12,2)               |           |          |                                         | main     |             |              | 
hourly_low_value   | numeric(12,2)               |           |          |                                         | main     |             |              | 
hourly_high_value  | numeric(12,2)               |           |          |                                         | main     |             |              | 
fortnightly_salary | numeric(12,2)               |           |          |                                         | main     |             |              | 
monthly_salary     | numeric(12,2)               |           |          |                                         | main     |             |              | 
total_pay_min      | numeric(12,2)               |           |          |                                         | main     |             |              | 
total_pay_max      | numeric(12,2)               |           |          |                                         | main     |             |              | 
bonus_range_min    | numeric(12,2)               |           |          |                                         | main     |             |              | 
bonus_range_max    | numeric(12,2)               |           |          |                                         | main     |             |              | 
profit_sharing_min | numeric(12,2)               |           |          |                                         | main     |             |              | 
profit_sharing_max | numeric(12,2)               |           |          |                                         | main     |             |              | 
commission_min     | numeric(12,2)               |           |          |                                         | main     |             |              | 
commission_max     | numeric(12,2)               |           |          |                                         | main     |             |              | 
gender_male        | numeric(5,2)                |           |          |                                         | main     |             |              | 
gender_female      | numeric(5,2)                |           |          |                                         | main     |             |              | 
one_yr             | numeric(12,2)               |           |          |                                         | main     |             |              | 
one_four_yrs       | numeric(12,2)               |           |          |                                         | main     |             |              | 
five_nine_yrs      | numeric(12,2)               |           |          |                                         | main     |             |              | 
ten_nineteen_yrs   | numeric(12,2)               |           |          |                                         | main     |             |              | 
twenty_yrs_plus    | numeric(12,2)               |           |          |                                         | main     |             |              | 
percentile_10      | numeric(12,2)               |           |          |                                         | main     |             |              | 
percentile_25      | numeric(12,2)               |           |          |                                         | main     |             |              | 
percentile_50      | numeric(12,2)               |           |          |                                         | main     |             |              | 
percentile_75      | numeric(12,2)               |           |          |                                         | main     |             |              | 
percentile_90      | numeric(12,2)               |           |          |                                         | main     |             |              | 
skills             | jsonb                       |           |          | '[]'::jsonb                             | extended |             |              | 
data_source        | character varying(50)       |           |          | 'admin_import'::character varying       | extended |             |              | 
contribution_count | integer                     |           |          | 0                                       | plain    |             |              | 
last_verified_at   | timestamp without time zone |           |          |                                         | plain    |             |              | 
created_at         | timestamp without time zone |           |          | now()                                   | plain    |             |              | 
updated_at         | timestamp without time zone |           |          | now()                                   | plain    |             |              | 
company_name       | text                        |           |          |                                         | extended |             |   
Indexes:
"occupations_pkey" PRIMARY KEY, btree (id)
"idx_occ_full_arbiter" UNIQUE, btree (country, COALESCE(state, ''::character varying), COALESCE(location, ''::character varying), slug_url)
"idx_occ_occname_lower" btree (lower(occ_name))
"idx_occ_sort_title_company" btree (lower(COALESCE(title, occ_name, ''::text)), lower(COALESCE(company_name, ''::text)))
"idx_occ_title_lower" btree (lower(title))
"idx_occupations_company_name" btree (company_name)
"idx_occupations_company_name_ci" btree (lower(company_name))
"idx_occupations_country" btree (country)
"idx_occupations_country_ci" btree (lower(country::text))
"idx_occupations_country_state" btree (country, state) WHERE state IS NOT NULL
"idx_occupations_country_state_ci" btree (lower(country::text), lower(state::text)) WHERE state IS NOT NULL
"idx_occupations_country_state_location" btree (country, state, location) WHERE location IS NOT NULL
"idx_occupations_country_state_location_ci" btree (lower(country::text), lower(state::text), lower(location::text)) WHERE location IS NOT NULL
"idx_occupations_data_source" btree (data_source)
"idx_occupations_last_verified" btree (last_verified_at) WHERE last_verified_at IS NOT NULL
"idx_occupations_location_ci" btree (lower(location::text)) WHERE location IS NOT NULL
"idx_occupations_location_not_null" btree (location) WHERE location IS NOT NULL
"idx_occupations_occ_name_search" gin (to_tsvector('english'::regconfig, occ_name))
"idx_occupations_skills" gin (skills)
"idx_occupations_slug" btree (slug_url)
"idx_occupations_state_ci" btree (lower(state::text)) WHERE state IS NOT NULL
"idx_occupations_state_not_null" btree (state) WHERE state IS NOT NULL
Triggers:
update_occupations_metadata BEFORE UPDATE ON occupations FOR EACH ROW EXECUTE FUNCTION update_occupation_metadata()
Access method: heap


rollthepay=# SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'occupations';

          indexname                 |                                                                                           indexdef                                                                                            
-------------------------------------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
occupations_pkey                          | CREATE UNIQUE INDEX occupations_pkey ON public.occupations USING btree (id)
idx_occupations_country                   | CREATE INDEX idx_occupations_country ON public.occupations USING btree (country)
idx_occupations_country_state             | CREATE INDEX idx_occupations_country_state ON public.occupations USING btree (country, state) WHERE (state IS NOT NULL)
idx_occupations_country_state_location    | CREATE INDEX idx_occupations_country_state_location ON public.occupations USING btree (country, state, location) WHERE (location IS NOT NULL)
idx_occupations_slug                      | CREATE INDEX idx_occupations_slug ON public.occupations USING btree (slug_url)
idx_occupations_skills                    | CREATE INDEX idx_occupations_skills ON public.occupations USING gin (skills)
idx_occupations_state_not_null            | CREATE INDEX idx_occupations_state_not_null ON public.occupations USING btree (state) WHERE (state IS NOT NULL)
idx_occupations_location_not_null         | CREATE INDEX idx_occupations_location_not_null ON public.occupations USING btree (location) WHERE (location IS NOT NULL)
idx_occupations_data_source               | CREATE INDEX idx_occupations_data_source ON public.occupations USING btree (data_source)
idx_occupations_last_verified             | CREATE INDEX idx_occupations_last_verified ON public.occupations USING btree (last_verified_at) WHERE (last_verified_at IS NOT NULL)
idx_occupations_occ_name_search           | CREATE INDEX idx_occupations_occ_name_search ON public.occupations USING gin (to_tsvector('english'::regconfig, occ_name))
idx_occupations_company_name              | CREATE INDEX idx_occupations_company_name ON public.occupations USING btree (company_name)
idx_occupations_company_name_ci           | CREATE INDEX idx_occupations_company_name_ci ON public.occupations USING btree (lower(company_name))
idx_occ_sort_title_company                | CREATE INDEX idx_occ_sort_title_company ON public.occupations USING btree (lower(COALESCE(title, occ_name, ''::text)), lower(COALESCE(company_name, ''::text)))
idx_occ_full_arbiter                      | CREATE UNIQUE INDEX idx_occ_full_arbiter ON public.occupations USING btree (country, COALESCE(state, ''::character varying), COALESCE(location, ''::character varying), slug_url)
idx_occupations_country_ci                | CREATE INDEX idx_occupations_country_ci ON public.occupations USING btree (lower((country)::text))
idx_occupations_state_ci                  | CREATE INDEX idx_occupations_state_ci ON public.occupations USING btree (lower((state)::text)) WHERE (state IS NOT NULL)
idx_occupations_location_ci               | CREATE INDEX idx_occupations_location_ci ON public.occupations USING btree (lower((location)::text)) WHERE (location IS NOT NULL)
idx_occupations_country_state_ci          | CREATE INDEX idx_occupations_country_state_ci ON public.occupations USING btree (lower((country)::text), lower((state)::text)) WHERE (state IS NOT NULL)
idx_occupations_country_state_location_ci | CREATE INDEX idx_occupations_country_state_location_ci ON public.occupations USING btree (lower((country)::text), lower((state)::text), lower((location)::text)) WHERE (location IS NOT NULL)
idx_occ_title_lower                       | CREATE INDEX idx_occ_title_lower ON public.occupations USING btree (lower(title))
idx_occ_occname_lower                     | CREATE INDEX idx_occ_occname_lower ON public.occupations USING btree (lower(occ_name))
(22 rows)

~
~