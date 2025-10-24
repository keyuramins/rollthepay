# PostgreSQL Migration Guide for RollThePay

This guide provides step-by-step instructions for migrating RollThePay from Filebrowser CSV data source to PostgreSQL 17 with PgBouncer connection pooling.

## Overview

The migration involves:
1. **Pre-migration setup** - Database schema and configuration
2. **Data migration** - Import CSV data from Filebrowser to PostgreSQL
3. **Application updates** - Replace Filebrowser API with PostgreSQL queries
4. **Post-migration cleanup** - Remove Filebrowser dependencies

## Prerequisites

- ✅ PostgreSQL 17 installed and configured
- ✅ PgBouncer installed and configured
- ✅ Node.js 18+ and npm
- ✅ Access to existing Filebrowser CSV data
- ✅ Admin access to the application

## Phase 1: Pre-Migration Setup

### 1.1 Environment Configuration

Copy the environment template and configure your PostgreSQL connection:

```bash
# Copy environment template
cp env.example .env.local

# Edit .env.local with your actual PostgreSQL details
nano .env.local
```

**Required Environment Variables:**

```bash
# PostgreSQL Direct Connection (for migrations, admin tasks)
POSTGRES_URL=postgres://postgres:your_password@your_host:5432/rollthepay

# PgBouncer Connection (for application queries via port 6432)
PGBOUNCER_URL=postgres://postgres:your_password@your_host:6432/rollthepay

# Application database URL (Next.js will use PgBouncer)
DATABASE_URL=postgres://postgres:your_password@your_host:6432/rollthepay

# Connection pool configuration
PGPOOL_MAX=20
PGPOOL_IDLE_TIMEOUT=30000
PGPOOL_CONNECTION_TIMEOUT=10000

# Admin API authentication (generate a secure random key)
ADMIN_API_KEY=your_secure_random_api_key_here

### 1.2 Install Dependencies

```bash
# Install PostgreSQL client and TypeScript execution tools
npm install
```

### 1.3 Test Database Connection

```bash
# Test PostgreSQL connection
npm run db:test-connection
```

Expected output:
```bash
✅ Connection successful
{
  "success": true,
  "details": {
    "currentTime": "2024-01-15T10:30:00.000Z",
    "pgVersion": "PostgreSQL 17.0",
    "connectionDuration": "45ms",
    "poolConfig": {
      "max": 20,
      "idleTimeout": 30000,
      "connectionTimeout": 10000
    }
  }
}
```

### 1.4 Setup Database Schema

```bash
# Create database schema, indexes, and materialized views
npm run db:setup
```

Expected output:
```bash
🚀 Starting database setup...
🔌 Testing database connection...
✅ Connected to PostgreSQL at 2024-01-15T10:30:00.000Z
📋 PostgreSQL version: PostgreSQL 17.0
📖 Reading schema file...
🏗️ Creating database schema...
✅ Database schema created successfully
📋 Created tables: occupations
📋 Created indexes: 12 indexes
📋 Created materialized views: 2 views
📋 Created triggers: 1 trigger
🧪 Testing basic operations...
✅ Test record inserted with ID: 1
✅ Test record retrieved: Test Occupation
✅ Test record updated: salary = 60000
✅ Trigger test: contribution_count = 1
✅ Test record cleaned up
🔄 Testing materialized view refresh...
✅ Materialized views refreshed successfully
🎉 Database setup completed successfully!
```

## Phase 2: Data Migration

### 2.1 Run CSV Migration

```bash
# Migrate all CSV data from Filebrowser to PostgreSQL
npm run db:migrate
```

Expected output:
```bash
🚀 Starting CSV → PostgreSQL migration...
📅 Started at: 2024-01-15T10:30:00.000Z
🔌 Testing database connection...
✅ Connected to PostgreSQL at 2024-01-15T10:30:00.000Z
📁 Discovering CSV files from Filebrowser...
📋 Found 3 CSV files: countries.csv, states.csv, occupations.csv
📊 Processing countries.csv...
  📄 Parsed 195 rows from CSV
  ✅ 195 valid records, 0 skipped
  💾 Inserted 195 records into database
  📊 Progress: 100% (195/195 records)
📊 Processing states.csv...
  📄 Parsed 1,247 rows from CSV
  ✅ 1,247 valid records, 0 skipped
  💾 Inserted 1,247 records into database
  📊 Progress: 100% (1,247/1,247 records)
📊 Processing occupations.csv...
  📄 Parsed 25,000 rows from CSV
  ✅ 24,987 valid records, 13 skipped
  💾 Inserted 24,987 records into database
  📊 Progress: 100% (24,987/24,987 records)
🔄 Refreshing materialized views...
✅ Materialized views refreshed
🎉 Migration completed successfully!
📋 Migration Report:
  📁 Files processed: 3
  📄 Total rows processed: 26,442
  ✅ Records inserted: 26,429
  ⏭️  Records skipped: 13
  ⏱️  Duration: 45 seconds
  📊 Average: 587 records/second
🔍 Verifying migration...
📊 Final database statistics:
  🏢 Total occupations: 24,987
  🌍 Total countries: 195
  🏛️  Total states: 1,247
  🏙️  Total locations: 3,456
✅ Migration verification completed!
🚀 Database is ready for use!
```

### 2.2 Validate Migration

```bash
# Validate migrated data integrity
npm run db:validate
```

Expected output:
```bash
🔍 Starting database schema validation...
📅 Started at: 2024-01-15T10:35:00.000Z
🔌 Testing database connection...
✅ Connected to PostgreSQL at 2024-01-15T10:35:00.000Z
📋 PostgreSQL version: PostgreSQL 17.0
📋 Validating table structure...
✅ Found 55 columns in occupations table
🔍 Validating indexes...
✅ Found 12 indexes on occupations table
🔒 Validating constraints...
✅ Found 2 constraints on occupations table
📊 Validating materialized views...
✅ Found 2 materialized views
⚡ Validating triggers...
✅ Found 1 triggers
📊 Checking data integrity...
✅ Total records: 26,429
✅ Required fields check:
  - Records with title: 26,429/26,429
  - Records with slug_url: 26,429/26,429
  - Records with country: 26,429/26,429
✅ No duplicate records found
✅ Skills JSONB format check:
  - Records with skills: 18,456/26,429
  - Valid skills arrays: 18,456/26,429
✅ Sample skills data:
  1. [{"name":"JavaScript","percentage":85},{"name":"React","percentage":72}]
  2. [{"name":"Python","percentage":90},{"name":"Django","percentage":68}]
🌍 Checking geographic distribution...
✅ Geographic distribution:
  - Countries: 195
  - States: 1,247
  - Locations: 3,456
  - Country-only records: 5,234
  - State-only records: 12,345
  - Location-specific records: 8,850
💰 Checking salary data quality...
✅ Salary data quality:
  - Records with avg_annual_salary: 24,987/26,429
  - Records with low_salary: 24,987/26,429
  - Records with high_salary: 24,987/26,429
  - Average salary: 75,432
  - Salary range: 25,000 - 250,000
📊 Checking materialized view data...
✅ Materialized view data:
  - mv_country_stats: 195 countries
  - mv_state_stats: 1,247 states
⚡ Performance check...
✅ Sample query performance: 12ms
🔍 Checking index usage...
✅ Index usage statistics:
  - idx_occupations_country: 1,234 scans, 26,429 tuples read
  - idx_occupations_slug: 987 scans, 987 tuples read
🎉 Schema validation completed successfully!
```

## Phase 3: Application Testing

### 3.1 Test Application with PostgreSQL

```bash
# Start the development server
npm run dev
```

Visit your application and test:
- ✅ Home page loads
- ✅ Country pages load (e.g., `/australia`)
- ✅ State pages load (e.g., `/australia/victoria`)
- ✅ Location pages load (e.g., `/australia/victoria/melbourne`)
- ✅ Occupation pages load (e.g., `/australia/software-engineer`)
- ✅ Search functionality works
- ✅ Related occupations display correctly

### 3.2 Test Admin API

```bash
# Test admin API endpoints
curl -X GET "http://localhost:3000/api/admin/occupations" \
  -H "x-api-key: your_admin_api_key"

# Test salary update
curl -X PATCH "http://localhost:3000/api/admin/occupations/1" \
  -H "x-api-key: your_admin_api_key" \
  -H "Content-Type: application/json" \
  -d '{"avg_annual_salary": 95000, "low_salary": 75000, "high_salary": 115000}'
```

## Phase 4: Post-Migration Cleanup

### 4.1 Remove Filebrowser Dependencies

After successful migration and testing:

```bash
# Remove Filebrowser environment variables from .env.local
# Delete these lines:
# FILEBROWSER_BASE_URL=...
# FILEBROWSER_API_KEY=...

# Remove Filebrowser files
rm -rf lib/filebrowser/
rm lib/data/filebrowser-parse.ts
rm scripts/migrate-to-filebrowser.js

# Remove from package.json scripts
# Delete: "migrate-to-filebrowser": "node scripts/migrate-to-filebrowser.js"
```

### 4.2 Update Documentation

Update `README.md` to reflect PostgreSQL as the data source:

```markdown
## Data Source

RollThePay now uses PostgreSQL 17 as the primary data store with PgBouncer connection pooling for high-performance concurrent reads and writes.

### Database Schema

- **Single table design**: `occupations` table with optimized indexes
- **User contributions**: Salary fields are easily editable via Admin API
- **Skills data**: Stored as JSONB for flexibility
- **Geographic hierarchy**: Country → State → Location → Occupation
- **Materialized views**: For fast aggregations and statistics

### Admin API

- **CRUD operations**: Full occupation management
- **Salary updates**: Easy user contribution support
- **Bulk imports**: CSV import for data updates
- **Authentication**: Secure API key-based access
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed

**Error:** `Connection failed: ECONNREFUSED`

**Solution:**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection details in .env.local
npm run db:test-connection

# Verify PostgreSQL is listening on correct port
netstat -tlnp | grep 5432
```

#### 2. Migration Failed

**Error:** `No CSV files found in Filebrowser`

**Solution:**
```bash
# Verify Filebrowser environment variables
echo $FILEBROWSER_BASE_URL
echo $FILEBROWSER_API_KEY

# Test Filebrowser connection
curl -H "Authorization: Bearer $FILEBROWSER_API_KEY" "$FILEBROWSER_BASE_URL/api/resources"

# Check CSV files exist
curl -H "Authorization: Bearer $FILEBROWSER_API_KEY" "$FILEBROWSER_BASE_URL/api/resources/rollthepay"
```

#### 3. Schema Validation Failed

**Error:** `Duplicate records found`

**Solution:**
```bash
# Check for duplicate records
psql $POSTGRES_URL -c "
SELECT country, COALESCE(state, ''), COALESCE(location, ''), slug_url, COUNT(*)
FROM occupations
GROUP BY country, COALESCE(state, ''), COALESCE(location, ''), slug_url
HAVING COUNT(*) > 1;
"

# Clean up duplicates if needed
psql $POSTGRES_URL -c "
DELETE FROM occupations 
WHERE id NOT IN (
  SELECT MIN(id) 
  FROM occupations 
  GROUP BY country, COALESCE(state, ''), COALESCE(location, ''), slug_url
);
"
```

#### 4. Performance Issues

**Error:** Slow query performance

**Solution:**
```bash
# Refresh materialized views
npm run db:refresh-views

# Reindex tables
npm run db:reindex

# Check index usage
psql $POSTGRES_URL -c "SELECT * FROM pg_stat_user_indexes WHERE schemaname = 'public';"
```

### Performance Monitoring

Monitor these key metrics:

```bash
# Database statistics
psql $POSTGRES_URL -c "SELECT * FROM pg_stat_database WHERE datname = 'rollthepay';"

# Connection statistics
psql $POSTGRES_URL -c "SELECT * FROM pg_stat_activity WHERE datname = 'rollthepay';"

# Index usage
psql $POSTGRES_URL -c "SELECT * FROM pg_stat_user_indexes WHERE schemaname = 'public';"

# Query performance
psql $POSTGRES_URL -c "SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;"
```

## Rollback Plan

If issues occur, you can rollback to Filebrowser:

1. **Restore Filebrowser files:**
   ```bash
   git checkout HEAD~1 -- lib/filebrowser/
   git checkout HEAD~1 -- lib/data/filebrowser-parse.ts
   ```

2. **Restore environment variables:**
   ```bash
   # Add back to .env.local:
   FILEBROWSER_BASE_URL=http://your-filebrowser-server:port
   FILEBROWSER_API_KEY=your_filebrowser_api_key_here
   ```

3. **Restart application:**
   ```bash
   npm run dev
   ```

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review PostgreSQL and PgBouncer logs
3. Test database connectivity with `npm run db:test-connection`
4. Validate schema with `npm run db:validate`

## Migration Checklist

- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] Schema created successfully
- [ ] CSV data migrated
- [ ] Migration validated
- [ ] Application tested
- [ ] Admin API tested
- [ ] Filebrowser dependencies removed
- [ ] Documentation updated
- [ ] Performance monitoring setup

## Next Steps

After successful migration:

1. **Monitor performance** - Set up monitoring for database metrics
2. **Backup strategy** - Implement regular database backups
3. **User contributions** - Enable user salary updates via Admin API
4. **Scaling** - Consider read replicas for high traffic
5. **Optimization** - Monitor and optimize slow queries

---

**Migration completed successfully!** 🎉

Your RollThePay application is now running on PostgreSQL with high-performance connection pooling and user contribution support.
