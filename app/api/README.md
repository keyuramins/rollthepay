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

### **⚠️ IMPORTANT: CSV Header Format**
**All CSV column headers must use snake_case format** (e.g., `avg_annual_salary`, not `avgAnnualSalary`).

The CSV parser reads headers as-is from your file, so ensure your CSV headers match the snake_case format shown below.

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
- `avg_annual_salary` - Average annual salary
- `avg_hourly_salary` - Average hourly rate
- `hourly_low_value` - Minimum hourly rate
- `hourly_high_value` - Maximum hourly rate
- `fortnightly_salary` - Fortnightly salary
- `monthly_salary` - Monthly salary
- `total_pay_min` - Minimum total compensation
- `total_pay_max` - Maximum total compensation

#### **Additional Compensation:**
- `bonus_range_min` - Minimum bonus
- `bonus_range_max` - Maximum bonus
- `profit_sharing_min` - Minimum profit sharing
- `profit_sharing_max` - Maximum profit sharing
- `commission_min` - Minimum commission
- `commission_max` - Maximum commission

#### **Years of Experience:**
- `one_yr` - 1 year experience salary
- `one_four_yrs` - 1-4 years experience salary
- `five_nine_yrs` - 5-9 years experience salary
- `ten_nineteen_yrs` - 10-19 years experience salary
- `twenty_yrs_plus` - 20+ years experience salary

#### **Gender Distribution:**
- `gender_male` - Male percentage (0-100)
- `gender_female` - Female percentage (0-100)

#### **Salary Percentiles:**
- `percentile_10` - 10th percentile salary
- `percentile_25` - 25th percentile salary
- `percentile_50` - 50th percentile (median) salary
- `percentile_75` - 75th percentile salary
- `percentile_90` - 90th percentile salary

#### **Skills** (JSON array format, up to 10 skills):
- `skills` - JSON string array of skill objects: `[{"name": "Python", "percentage": 85}, {"name": "JavaScript", "percentage": 75}]`
  - Supports double-encoded JSON (will be parsed automatically)
  - Only skills with both `name` and `percentage` (non-null) will be imported
  - Maximum 10 skills per record

### **Example CSV:**

```csv
title,slug_url,country,state,location,avg_annual_salary,skills
Software Engineer,software-engineer,Australia,New South Wales,Sydney,120000,"[{""name"": ""Python"", ""percentage"": 85}, {""name"": ""JavaScript"", ""percentage"": 75}]"
Data Analyst,data-analyst,Australia,Victoria,Melbourne,95000,"[{""name"": ""SQL"", ""percentage"": 90}, {""name"": ""Python"", ""percentage"": 80}]"
Product Manager,product-manager,India,Maharashtra,Mumbai,2500000,"[{""name"": ""Product Management"", ""percentage"": 95}, {""name"": ""Agile"", ""percentage"": 85}]"
```

**Note**: Skills column uses JSON array format. Ensure proper CSV escaping for quotes within the JSON string.

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
   - Inserts records one-by-one within a transaction
   - Uses `ON CONFLICT` to skip existing records (no update, just skip)
   - Conflict resolution matches unique index: `(country, COALESCE(state, ''), COALESCE(location, ''), slug_url)`
   - Handles NULL values in state/location fields correctly
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

### **1. Duplicate Handling**
If a record exists (same `country`, `state`, `location`, `slug_url`), it is skipped (no update):
- Uses `ON CONFLICT ... DO NOTHING` to prevent duplicate key errors
- Handles NULL values in state/location fields using COALESCE
- Returns count of inserted vs skipped records in response

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
The below scripts to be run from the local PC
keyur@Keyurs-iMac rollthepay % source .env
keyur@Keyurs-iMac rollthepay % psql $DATABASE_URL -c "\COPY occupations(slug_url, title, occ_name, country, state, location, avg_annual_salary, avg_hourly_salary, hourly_low_value, hourly_high_value, fortnightly_salary, monthly_salary, total_pay_min, total_pay_max, bonus_range_min, bonus_range_max, profit_sharing_min, profit_sharing_max, commission_min, commission_max, gender_male, gender_female, one_yr, one_four_yrs, five_nine_yrs, ten_nineteen_yrs, twenty_yrs_plus, percentile_10, percentile_25, percentile_50, percentile_75, percentile_90, skills, data_source, contribution_count, last_verified_at, created_at, updated_at, company_name) FROM '/Users/keyur/Downloads/kazakhstan.csv' WITH CSV HEADER"
COPY 211
keyur@Keyurs-iMac rollthepay % psql $DATABASE_URL -c "REFRESH MATERIALIZED VIEW mv_country_stats;"

keyur@Keyurs-iMac rollthepay % psql $DATABASE_URL -c "REFRESH MATERIALIZED VIEW mv_state_stats;"

keyur@Keyurs-iMac rollthepay % psql $DATABASE_URL -c "SELECT COUNT(*), country FROM occupations WHERE country = 'Kazakhstan' GROUP BY country;"
 count | country 
-------+---------
   211 | Namibia
(1 row)
