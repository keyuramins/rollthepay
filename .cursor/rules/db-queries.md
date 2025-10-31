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
SET location = 'Prayagraj'
WHERE country = 'India'
  AND location = 'Allahabad';

UPDATE occupations
SET location = ''
WHERE country = 'India' AND state = 'Chandigarh' AND location = 'Chandigarh';

Change the slug_url
UPDATE occupations
SET slug_url = REGEXP_REPLACE(slug_url, '-salary-ahmadnagar', '-salary-ahilyanagar', 'gi')
WHERE country = 'India'
  AND slug_url ILIKE '%-salary-ahmadnagar%';

  or

  UPDATE occupations
SET slug_url = REGEXP_REPLACE(slug_url, '-allahabad', '-prayagraj', 'gi')
WHERE country = 'India'
  AND slug_url ILIKE '%-allahabad%';

