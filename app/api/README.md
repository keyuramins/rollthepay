# API Documentation

This document explains the API endpoints available in the RollThePay application, including how to import CSV data into the database.

## 📁 API Folder Structure

The API folder (`app/api/`) contains three main administrative endpoints:

### 1. **CSV Import API** (`/api/admin/import-csv/`)
The primary route for bulk importing occupation data from CSV files.

### 2. **Occupations Management API** (`/api/admin/occupations/`)
CRUD operations for individual occupation records.

### 3. **Search API** (`/api/admin/occupations/search/`)
Search functionality for occupations (used by the searchable dropdown).

---

## 🔐 Authentication

All admin endpoints require API key authentication:
- **Header**: `x-api-key: your-secret-key`
- **Environment Variable**: `ADMIN_API_KEY` must be set in your `.env` file

```bash
# .env
ADMIN_API_KEY=your-secure-secret-key-here
```

---

## 📤 How to Import CSV Files

### **Method 1: Using cURL** (Command Line)

```bash
curl -X POST \
  -H "x-api-key: your-secret-api-key" \
  -F "file=@/path/to/your/data.csv" \
  http://localhost:3000/api/admin/import-csv
```

### **Method 2: Using Postman or Insomnia**

1. **Method**: POST
2. **URL**: `http://localhost:3000/api/admin/import-csv`
3. **Headers**: 
   - `x-api-key`: `your-secret-api-key`
4. **Body**: 
   - Type: `form-data`
   - Key: `file`
   - Value: Select your CSV file

### **Method 3: Using JavaScript/Fetch**

```typescript
const formData = new FormData();
formData.append('file', csvFile); // csvFile is a File object

const response = await fetch('/api/admin/import-csv', {
  method: 'POST',
  headers: {
    'x-api-key': 'your-secret-api-key'
  },
  body: formData
});

const result = await response.json();
console.log(result);
```

---

## 📋 CSV Format Requirements

### **File Constraints:**
- **File Type**: Must be `.csv` format
- **Maximum Size**: 50MB
- **Encoding**: UTF-8 recommended

### **Required Columns:**
- `title` - Job title (e.g., "Software Engineer")
- `slug_url` - URL-safe slug (lowercase, hyphenated, e.g., "software-engineer")
- `country` - Country name (e.g., "Australia", "India")

### **Optional Columns** (all mapped by the import route):

#### **Basic Information:**
- `occ_name` - Occupation name
- `state` - State/province name
- `location` - City/locality name
- `currency` - Currency code (e.g., AUD, INR)
- `company_name` - Company name

#### **Salary Data:**
- `avgAnnualSalary` - Average annual salary
- `avgHourlySalary` - Average hourly rate
- `hourlyLowValue` - Minimum hourly rate
- `hourlyHighValue` - Maximum hourly rate
- `fortnightlySalary` - Fortnightly salary
- `monthlySalary` - Monthly salary
- `totalPayMin` - Minimum total compensation
- `totalPayMax` - Maximum total compensation

#### **Additional Compensation:**
- `bonusRangeMin` - Minimum bonus
- `bonusRangeMax` - Maximum bonus
- `profitSharingMin` - Minimum profit sharing
- `profitSharingMax` - Maximum profit sharing
- `commissionMin` - Minimum commission
- `commissionMax` - Maximum commission

#### **Experience Levels:**
- `entryLevel` - Entry level salary
- `earlyCareer` - Early career salary (1-4 years)
- `midCareer` - Mid career salary (5-9 years)
- `experienced` - Experienced salary (10-19 years)
- `lateCareer` - Late career salary (20+ years)

#### **Years of Experience:**
- `oneYr` - 1 year experience salary
- `oneFourYrs` - 1-4 years experience salary
- `fiveNineYrs` - 5-9 years experience salary
- `tenNineteenYrs` - 10-19 years experience salary
- `twentyYrsPlus` - 20+ years experience salary

#### **Gender Distribution:**
- `genderMale` - Male percentage (0-100)
- `genderFemale` - Female percentage (0-100)

#### **Salary Percentiles:**
- `10P` - 10th percentile salary
- `25P` - 25th percentile salary
- `50P` - 50th percentile (median) salary
- `75P` - 75th percentile salary
- `90P` - 90th percentile salary

#### **Skills** (up to 10 skills):
- `skillsNameOne`, `skillsNamePercOne` - First skill name and percentage
- `skillsNameTwo`, `skillsNamePercTwo` - Second skill name and percentage
- `skillsNameThree`, `skillsNamePercThree` - Third skill name and percentage
- `skillsNameFour`, `skillsNamePercFour` - Fourth skill name and percentage
- `skillsNameFive`, `skillsNamePercFive` - Fifth skill name and percentage
- `skillsNameSix`, `skillsNamePercSix` - Sixth skill name and percentage
- `skillsNameSeven`, `skillsNamePercSeven` - Seventh skill name and percentage
- `skillsNameEight`, `skillsNamePercEight` - Eighth skill name and percentage
- `skillsNameNine`, `skillsNamePercNine` - Ninth skill name and percentage
- `skillsNameTen`, `skillsNamePercTen` - Tenth skill name and percentage

### **Example CSV:**

```csv
title,slug_url,country,state,location,avgAnnualSalary,currency,skillsNameOne,skillsNamePercOne,skillsNameTwo,skillsNamePercTwo
Software Engineer,software-engineer,Australia,New South Wales,Sydney,120000,90000,150000,AUD,Python,85,JavaScript,75
Data Analyst,data-analyst,Australia,Victoria,Melbourne,95000,70000,120000,AUD,SQL,90,Python,80
Product Manager,product-manager,India,Maharashtra,Mumbai,2500000,1800000,3500000,INR,Product Management,95,Agile,85
```

---

## ⚙️ How the Import Process Works

1. **Authentication**: Validates your API key against `ADMIN_API_KEY` environment variable
2. **File Validation**: 
   - Must be a `.csv` file
   - Maximum size: 50MB
3. **CSV Parsing**: Uses `csv-parse` library to parse the CSV content
4. **Data Transformation**: 
   - Converts CSV rows to database format
   - Skills columns are transformed to JSONB array
   - Numbers are coerced (handles commas, currency symbols)
   - Invalid tokens like `#REF!` are filtered out
   - Missing or invalid required fields cause row to be skipped
5. **Bulk Insert**: 
   - Inserts in batches of 1000 records
   - Uses `ON CONFLICT` to update existing records (upsert)
   - Conflict resolution on: `(country, state, location, slug_url)`
   - Wrapped in PostgreSQL transaction (ROLLBACK on error)
6. **Materialized Views Refresh**: 
   - Refreshes `mv_country_stats`
   - Refreshes `mv_state_stats`
7. **Response**: Returns detailed summary with statistics

---

## 📊 Import Response Format

### **Success Response:**
```json
{
  "success": true,
  "message": "CSV import completed successfully",
  "summary": {
    "fileName": "occupations.csv",
    "fileSize": 1234567,
    "totalRows": 1000,
    "validRecords": 995,
    "insertedRecords": 995,
    "skippedRecords": 5,
    "duration": "3245ms",
    "errors": [
      "Row 10: Missing required fields (title, slug_url, or country)",
      "Row 25: Missing required fields (title, slug_url, or country)"
    ]
  }
}
```

### **Error Responses:**

#### `401 Unauthorized`
```json
{
  "error": "Unauthorized"
}
```
**Cause**: Missing or invalid API key

#### `400 Bad Request`
```json
{
  "error": "No file provided"
}
```
**Causes**: 
- No file uploaded
- File is not a CSV
- File exceeds 50MB
- No valid records found in CSV

#### `409 Conflict`
```json
{
  "error": "Some records already exist in the database (duplicate key constraint)"
}
```
**Cause**: Duplicate records (same country/state/location/slug_url combination)

#### `500 Internal Server Error`
```json
{
  "error": "CSV import failed",
  "details": "Error message here"
}
```
**Cause**: Database connection error or other server issues

---

## 🔍 Testing the API

### **Get API Documentation:**
```bash
curl -H "x-api-key: your-secret-key" \
  http://localhost:3000/api/admin/import-csv
```

**Response:**
```json
{
  "message": "CSV Import API",
  "usage": {
    "method": "POST",
    "endpoint": "/api/admin/import-csv",
    "headers": {
      "x-api-key": "Your admin API key",
      "Content-Type": "multipart/form-data"
    },
    "body": {
      "file": "CSV file (max 50MB)"
    }
  },
  "requirements": {
    "csvFormat": "Must have columns: title, slug_url, country",
    "fileSize": "Maximum 50MB",
    "fileType": "CSV files only"
  },
  "example": {
    "curl": "curl -X POST \\\n  -H \"x-api-key: your-api-key\" \\\n  -F \"file=@data.csv\" \\\n  http://localhost:3000/api/admin/import-csv"
  }
}
```

---

## 💡 Key Features

### **1. Upsert Logic**
If a record exists (same `country`, `state`, `location`, `slug_url`), it updates the existing record instead of failing:
- Updates `title`
- Updates `avg_annual_salary`
- Updates `updated_at` timestamp

### **2. Batch Processing**
Handles large files efficiently with 1000-record batches to prevent memory issues.

### **3. Transaction Safety**
Uses PostgreSQL transactions:
- `BEGIN` before insert
- `COMMIT` on success
- `ROLLBACK` on error

### **4. Data Validation**
- Skips invalid rows with detailed error reporting
- Validates required fields (title, slug_url, country)
- Filters out invalid tokens (`#REF!`, empty strings)
- Coerces numbers (removes commas, currency symbols)

### **5. Skills Transformation**
Automatically converts 10 separate skill columns into a JSONB array:
```json
[
  { "name": "Python", "percentage": 85 },
  { "name": "JavaScript", "percentage": 75 }
]
```

### **6. Automatic Cache Refresh**
Updates materialized views after import to ensure statistics are current:
- `mv_country_stats` - Country-level statistics
- `mv_state_stats` - State-level statistics

---

## 🚀 Quick Start Example

### **Step 1: Set up your environment**
```bash
# .env
ADMIN_API_KEY=my-secure-api-key-here
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
```

### **Step 2: Prepare your CSV**
Create a file named `occupations.csv`:
```csv
title,slug_url,country,state,avgAnnualSalary,currency
Software Engineer,software-engineer,Australia,New South Wales,120000,90000,150000,AUD
Data Analyst,data-analyst,Australia,Victoria,95000,70000,120000,AUD
Product Manager,product-manager,India,Maharashtra,2500000,1800000,3500000,INR
```

### **Step 3: Import**
```bash
curl -X POST \
  -H "x-api-key: my-secure-api-key-here" \
  -F "file=@occupations.csv" \
  http://localhost:3000/api/admin/import-csv
```

### **Step 4: Verify**
Check the response for import statistics and any errors.

---

## 🛠️ Other Admin API Endpoints

### **Occupations Management API**

#### **GET /api/admin/occupations**
List occupations with optional filters.

```bash
curl -H "x-api-key: your-secret-key" \
  "http://localhost:3000/api/admin/occupations?country=Australia&limit=50&offset=0"
```

#### **POST /api/admin/occupations**
Create a new occupation record.

```bash
curl -X POST \
  -H "x-api-key: your-secret-key" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "DevOps Engineer",
    "slug_url": "devops-engineer",
    "country": "Australia",
    "state": "Victoria",
    "avg_annual_salary": 130000
  }' \
  http://localhost:3000/api/admin/occupations
```

#### **PUT /api/admin/occupations**
Update an existing occupation record.

```bash
curl -X PUT \
  -H "x-api-key: your-secret-key" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 123,
    "avg_annual_salary": 135000
  }' \
  http://localhost:3000/api/admin/occupations
```

#### **DELETE /api/admin/occupations**
Delete an occupation record.

```bash
curl -X DELETE \
  -H "x-api-key: your-secret-key" \
  "http://localhost:3000/api/admin/occupations?id=123"
```

### **Search API**

#### **GET /api/admin/occupations/search**
Search for occupations.

```bash
curl -H "x-api-key: your-secret-key" \
  "http://localhost:3000/api/admin/occupations/search?country=australia&search=engineer"
```

---

## 🔒 Security Best Practices

1. **Never commit your API key**: Add `.env` to `.gitignore`
2. **Use strong API keys**: Generate random, long keys (e.g., 32+ characters)
3. **Rotate keys regularly**: Change your API key periodically
4. **Limit API access**: Only share the key with trusted administrators
5. **Use HTTPS in production**: Never send API keys over unencrypted connections
6. **Monitor API usage**: Log all admin API calls for audit purposes

---

## 🐛 Troubleshooting

### **Problem: "Unauthorized" error**
**Solution**: 
- Verify `ADMIN_API_KEY` is set in `.env`
- Ensure header is `x-api-key` (lowercase)
- Check that the key matches exactly (no extra spaces)

### **Problem: "File must be a CSV file"**
**Solution**: 
- Ensure file extension is `.csv`
- Check file MIME type

### **Problem: "No valid records found in CSV"**
**Solution**: 
- Verify CSV has required columns: `title`, `slug_url`, `country`
- Check that CSV is not empty
- Ensure proper CSV formatting (commas, quotes)

### **Problem: "Duplicate key constraint" error**
**Solution**: 
- Records with same `(country, state, location, slug_url)` already exist
- The API will automatically update existing records (upsert)
- If you get this error, it means the upsert failed - check database constraints

### **Problem: "Database connection error"**
**Solution**: 
- Verify `DATABASE_URL` is set correctly in `.env`
- Ensure PostgreSQL is running
- Check database credentials
- Verify database exists

---

## 📝 Notes

- All numeric fields accept commas and currency symbols (e.g., "$120,000" becomes 120000)
- Empty values and `#REF!` errors are treated as `null`
- Skills are stored in JSONB format for efficient querying
- The import process is idempotent (can be run multiple times safely)
- Materialized views are automatically refreshed after each import

---

## 📚 Related Documentation

- [Database Schema](/docs/db-queries.md)
- [PostgreSQL Migration Guide](/docs/POSTGRESQL_MIGRATION.md)
- [Implementation Summary](/docs/IMPLEMENTATION_SUMMARY.md)

---

## 🤝 Support

For issues or questions, please refer to the main project README or contact the development team.

keyur@Keyurs-iMac rollthepay % source .env
keyur@Keyurs-iMac rollthepay % psql $DATABASE_URL -c "\COPY occupations(slug_url, title, occ_name, country, state, location, avg_annual_salary, avg_hourly_salary, hourly_low_value, hourly_high_value, fortnightly_salary, monthly_salary, total_pay_min, total_pay_max, bonus_range_min, bonus_range_max, profit_sharing_min, profit_sharing_max, commission_min, commission_max, gender_male, gender_female, entry_level, early_career, mid_career, experienced, late_career, one_yr, one_four_yrs, five_nine_yrs, ten_nineteen_yrs, twenty_yrs_plus, percentile_10, percentile_25, percentile_50, percentile_75, percentile_90, skills, data_source, contribution_count, last_verified_at, created_at, updated_at, company_name) FROM '/Users/keyur/Downloads/namibia.csv' WITH CSV HEADER"
COPY 211
keyur@Keyurs-iMac rollthepay % psql $DATABASE_URL -c "REFRESH MATERIALIZED VIEW mv_country_stats;"
REFRESH MATERIALIZED VIEW
keyur@Keyurs-iMac rollthepay % psql $DATABASE_URL -c "REFRESH MATERIALIZED VIEW mv_state_stats;"
REFRESH MATERIALIZED VIEW
keyur@Keyurs-iMac rollthepay % psql $DATABASE_URL -c "SELECT COUNT(*), country FROM occupations WHERE country = 'Namibia' GROUP BY country;"
 count | country 
-------+---------
   211 | Namibia
(1 row)

keyur@Keyurs-iMac rollthepay % 