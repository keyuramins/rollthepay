DELETE FROM occupations
WHERE country = 'India' AND state = 'Madhya Pradesh' AND location = 'Delhi';

SELECT DISTINCT state, location
FROM occupations
WHERE state = 'Chandigarh';


//Berlin within Berlin
UPDATE occupations
SET title = REPLACE(title, ', Chandigarh', '')
WHERE country = 'India' AND state = 'Chandigarh' AND location = 'Chandigarh';

UPDATE occupations
SET location = ''
WHERE country = 'India' AND state = 'Chandigarh' AND location = 'Chandigarh';
