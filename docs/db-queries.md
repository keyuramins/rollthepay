<!--Measure query plans -->
EXPLAIN ANALYZE
SELECT slug_url, title, occ_name, location, state, company_name, avg_annual_salary
FROM occupations
WHERE LOWER(country) = LOWER('cyprus')
  AND (LOWER(COALESCE(title,'')) LIKE 'p%' OR LOWER(COALESCE(occ_name,'')) LIKE 'p%')
ORDER BY LOWER(COALESCE(title, occ_name, '')), LOWER(COALESCE(company_name, ''))
LIMIT 50 OFFSET 0;

DELETE FROM occupations
WHERE country = 'India' AND state = 'Madhya Pradesh' AND location = 'Delhi';

SELECT DISTINCT state, location
FROM occupations
WHERE state = 'Chandigarh';

Move unique records from Noida, Delhi to Noida, Uttar Pradesh
UPDATE occupations o
SET state = 'Uttar Pradesh',
    location = 'Noida'
WHERE country = 'India'
  AND state = 'Delhi'
  AND location = 'Noida'
  AND NOT EXISTS (
    SELECT 1
    FROM occupations x
    WHERE x.country = o.country
      AND x.state = 'Uttar Pradesh'
      AND x.location = 'Noida'
      AND x.slug_url = o.slug_url
  );

To check how many records are exactly the same in both Delhi and Uttar Pradesh (Noida):
SELECT COUNT(*) AS duplicate_count
FROM occupations a
JOIN occupations b
  ON a.country = b.country
 AND a.location = b.location
 AND a.slug_url = b.slug_url
WHERE a.country = 'India'
  AND a.state = 'Delhi'
  AND a.location = 'Noida'
  AND b.state = 'Uttar Pradesh';

To check how many total records are in Noida, Delhi:
SELECT COUNT(*) AS noida_delhi_count
FROM occupations
WHERE country = 'India'
  AND state = 'Delhi'
  AND location = 'Noida';


Delete lower-salary duplicates in Uttar Pradesh
DELETE FROM occupations a
USING occupations b
WHERE a.country = b.country
  AND a.state = 'Uttar Pradesh'
  AND a.location = 'Noida'
  AND b.state = 'Delhi'
  AND b.location = 'Noida'
  AND a.slug_url = b.slug_url
  AND b.avg_annual_salary > a.avg_annual_salary
  AND a.country = 'India';

Move the higher-salary Delhi → Uttar Pradesh records
UPDATE occupations o
SET state = 'Uttar Pradesh'
WHERE country = 'India'
  AND state = 'Delhi'
  AND location = 'Noida'
  AND EXISTS (
    SELECT 1
    FROM occupations x
    WHERE x.country = o.country
      AND x.state = 'Uttar Pradesh'
      AND x.location = o.location
      AND x.slug_url = o.slug_url
      AND o.avg_annual_salary > x.avg_annual_salary
  );

Move any remaining unique Noida, Delhi rows
UPDATE occupations o
SET state = 'Uttar Pradesh'
WHERE o.country = 'India'
  AND o.state = 'Delhi'
  AND o.location = 'Noida'
  AND NOT EXISTS (
    SELECT 1
    FROM occupations x
    WHERE x.country = o.country
      AND x.state = 'Uttar Pradesh'
      AND x.location = o.location
      AND x.slug_url = o.slug_url
  );

Delete the location Noida in Delhi state with all its rows
DELETE FROM occupations
WHERE country = 'India'
  AND state = 'Uttar Pradesh'
  AND location = 'Gurugram';


//Berlin within Berlin
UPDATE occupations
SET title = REPLACE(title, ', Chandigarh', '')
WHERE country = 'India' AND state = 'Chandigarh' AND location = 'Chandigarh';

//Change name from Allahabad to Prayagraj
UPDATE occupations
SET location = ''
WHERE country = 'France'
    AND state = 'Paris'
    AND location = 'Paris';

UPDATE occupations
SET state = ''
WHERE country = 'China' AND state = 'Chongqing' AND location = 'Chongqing';

Change the slug_url
UPDATE occupations
SET slug_url = REGEXP_REPLACE(slug_url, '-salary-frankfurt-am-main', '-salary-frankfurt', 'gi')
WHERE country = 'Germany'
  AND slug_url ILIKE '%-salary-frankfurt-am-main%';

  or

UPDATE occupations
SET slug_url = REGEXP_REPLACE(slug_url, '-mohali', '-ajitgarh', 'gi')
WHERE country = 'India' AND slug_url ILIKE '%-mohali%';

UPDATE occupations o
SET state = 'Île-de-France'
WHERE o.country = 'France'
  AND o.state = 'Paris'
  AND NOT EXISTS (
    SELECT 1
    FROM occupations x
    WHERE x.country = o.country
      AND x.state = 'Île-de-France'
  );

  column_name     
--------------------
 avg_annual_salary
 avg_hourly_salary
 bonus_range_max
 bonus_range_min
 commission_max
 commission_min
 company_name
 contribution_count
 country
 created_at
 data_source
 five_nine_yrs
 fortnightly_salary
 gender_female
 gender_male
 hourly_high_value
 hourly_low_value
 id
 last_verified_at
 location
 monthly_salary
 occ_name
 one_four_yrs
 one_yr
 percentile_10
 percentile_25
 percentile_50
 percentile_75
 percentile_90
 profit_sharing_max
 profit_sharing_min
 skills
 slug_url
 state
 ten_nineteen_yrs
 title
 total_pay_max
 total_pay_min
 twenty_yrs_plus
 updated_at