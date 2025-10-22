<!-- 0230f668-dfb3-4221-b3fd-ab1f0072c25f a23d27a6-c3b0-4e35-be10-9e09cc75f219 -->
# PostgreSQL Migration Plan for RollThePay

## Overview

Migrate from Filebrowser CSV to PostgreSQL 17 with PgBouncer, maintaining the existing component architecture while replacing all data access logic with optimized database queries.

## Phase 1: Database Schema & Configuration

### 1.1 PostgreSQL Schema Design

Create optimized schema in `lib/db/schema.sql`:

- **occupations** table: Core salary data with JSONB for flexible fields (skills, related links)
- **countries** table: Country metadata with currency info
- **states** table: State/region data linked to countries
- **locations** table: City/locality data linked to states
- Indexes on: (country, state, location, slug_url), salary fields, full-text search on titles
- Partial indexes for state and location queries
- GiST index for JSONB fields

### 1.2 PostgreSQL Tuning Configuration

Create `postgresql.conf` tuning file:

```
shared_buffers = 8GB              # 25% of RAM for 32GB server
work_mem = 64MB                   # Per-operation memory
maintenance_work_mem = 2GB        # For bulk operations
effective_cache_size = 24GB       # 75% of RAM
wal_buffers = 16MB               # Write-ahead log buffers
checkpoint_timeout = 15min        # Checkpoint frequency
max_wal_size = 4GB               # WAL size before checkpoint
random_page_cost = 1.1           # SSD optimization
effective_io_concurrency = 200   # Parallel I/O
max_connections = 200            # Direct connections
```

### 1.3 PgBouncer Configuration

Create `pgbouncer.ini`:

- Pool mode: transaction (optimal for Next.js)
- Pool size: 25 per database
- Reserve pool: 5
- Max client connections: 1000
- Default pool size aligned with expected concurrent requests

## Phase 2: Database Access Layer

### 2.1 Database Client Setup

Create `lib/db/client.ts`:

- Use `pg` library with Pool for connection management
- Separate read and write pools if using replication
- Connection string from `POSTGRES_URL` and `PGBOUNCER_URL`
- Retry logic and error handling
- Query logging in development

### 2.2 Query Functions

Create `lib/db/queries.ts`:

- `getAllOccupations()`: Fetch all with pagination and caching
- `getOccupationByPath(country, state?, location?, slug)`: Find specific record
- `getOccupationsByCountry(country)`: Country-level data
- `getOccupationsByState(country, state)`: State-level data
- `getOccupationsByLocation(country, state, location)`: Location-level data
- `getStates(country)`: All states in country
- `getLocations(country, state)`: All locations in state
- `searchOccupations(query, filters)`: Full-text search
- Use prepared statements for all queries
- Implement query batching for related data

### 2.3 Replace Data Access Layer

Update `lib/data/db.ts` (renamed from parse.ts):

- Remove all CSV parsing logic
- Remove Filebrowser client imports
- Replace `getDataset()` with PostgreSQL queries
- Replace `findOccupationSalaryByPath()` with database lookup
- Replace `getStateData()` with SQL queries
- Replace `getLocationData()` with SQL queries
- Maintain same TypeScript interfaces (`OccupationRecord`, `DatasetIndex`)
- Add database-aware caching (Redis or in-memory with TTL)

## Phase 3: Migration Scripts

### 3.1 CSV Import Script

Create `scripts/import-csv-to-postgres.ts`:

- Connect to Filebrowser API to fetch all CSVs
- Parse CSVs using existing `lib/data/types.ts` schema
- Batch insert into PostgreSQL (1000 records per batch)
- Use `COPY` command for bulk efficiency
- Transaction-based with rollback on error
- Progress reporting and error logging
- Deduplicate records by (country, state, location, slug_url)

### 3.2 Migration Validation Script

Create `scripts/validate-migration.ts`:

- Compare record counts: CSV vs PostgreSQL
- Verify data integrity (sample random records)
- Check all indexes are created
- Validate foreign key relationships
- Generate migration report

### 3.3 Database Seed Script

Create `scripts/seed-database.ts`:

- Drop and recreate tables (development only)
- Run schema migrations
- Execute CSV import
- Run validation checks

## Phase 4: Admin API Endpoints

### 4.1 CRUD API Routes

Create `app/api/admin/occupations/route.ts`:

- `POST /api/admin/occupations`: Create occupation
- `PUT /api/admin/occupations/[id]`: Update occupation
- `DELETE /api/admin/occupations/[id]`: Delete occupation
- `GET /api/admin/occupations`: List with filters
- Authentication middleware (API key or JWT)
- Input validation with Zod schemas
- Audit logging for all changes

### 4.2 Bulk Import API

Create `app/api/admin/import/route.ts`:

- `POST /api/admin/import/csv`: Upload and import CSV
- Stream processing for large files
- Background job queue for async processing
- Progress tracking and status endpoint
- Error reporting with line numbers

### 4.3 Admin Dashboard (Optional)

Create basic admin UI in `app/admin`:

- Protected by authentication
- Simple forms for CRUD operations
- CSV upload interface
- Migration status display

## Phase 5: Environment & Configuration

### 5.1 Environment Variables

Update `.env.local.example`:

```bash
# PostgreSQL Configuration
POSTGRES_URL=postgres://user:password@host:5432/rollthepay
PGBOUNCER_URL=postgres://user:password@host:6432/rollthepay

# Connection Pool Settings
POSTGRES_MAX_CONNECTIONS=20
POSTGRES_IDLE_TIMEOUT=30

# Admin API Authentication
ADMIN_API_KEY=your-secure-api-key-here

# Remove Filebrowser variables
# FILEBROWSER_BASE_URL (deprecated)
# FILEBROWSER_API_KEY (deprecated)
```

### 5.2 Package Dependencies

Update `package.json`:

```json
{
  "dependencies": {
    "pg": "^8.11.3",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/pg": "^8.10.9"
  },
  "scripts": {
    "db:migrate": "tsx scripts/import-csv-to-postgres.ts",
    "db:validate": "tsx scripts/validate-migration.ts",
    "db:seed": "tsx scripts/seed-database.ts"
  }
}
```

## Phase 6: Update Application Code

### 6.1 Update Page Routes

Modify `app/[country]/[...url]/page.tsx`:

- Replace `optimizedDataAccess` calls with new database queries
- Remove Filebrowser bypass checks
- Update `generateStaticParams` to query PostgreSQL
- Maintain same routing logic and metadata generation

### 6.2 Update Components

Update components that fetch data:

- `components/country/states-grid.tsx`
- `components/state/locations-grid.tsx`
- `components/occupation/*` components
- Replace data access with database queries
- Maintain same props and rendering logic

### 6.3 Remove Legacy Code

Delete deprecated files:

- `lib/filebrowser/client.ts`
- `lib/data/filebrowser-parse.ts`
- `lib/data/parse.ts` (replaced by `lib/data/db.ts`)
- `scripts/migrate-to-filebrowser.js`

### 6.4 Update Optimized Parse Layer

Refactor `lib/data/optimized-parse.ts`:

- Replace in-memory caching with database queries
- Add database connection pooling
- Implement query result caching (Redis optional)
- Maintain same public API for components

## Phase 7: Caching Strategy

### 7.1 Query-Level Caching

Implement in `lib/db/cache.ts`:

- In-memory LRU cache for frequently accessed queries
- TTL-based expiration (aligned with ISR revalidation)
- Cache key generation from query params
- Cache invalidation on writes

### 7.2 ISR Integration

Update page revalidation:

- Keep `revalidate = 31536000` for static pages
- Add on-demand revalidation when data changes
- Implement revalidation endpoints for admin API

### 7.3 Connection Pooling

Configure in `lib/db/client.ts`:

- Primary pool for reads (larger pool)
- Secondary pool for writes (smaller pool)
- Statement-level pooling via PgBouncer
- Proper connection lifecycle management

## Phase 8: PgBouncer Setup Instructions

### 8.1 Installation Guide

Create `docs/pgbouncer-setup.md`:

- Installation steps for Ubuntu/Debian
- Configuration file setup
- SystemD service configuration
- Security best practices
- Monitoring and health checks

### 8.2 Connection Routing

Document in setup guide:

- Direct PostgreSQL: `localhost:5432` (for admin/migrations)
- Via PgBouncer: `localhost:6432` (for application)
- Connection string formats
- SSL/TLS configuration

## Phase 9: Documentation & Cleanup

### 9.1 Update README

Modify `README.md`:

- Replace Filebrowser setup with PostgreSQL setup
- Add database schema documentation
- Update technology stack section
- Add migration guide
- Update troubleshooting section

### 9.2 Update Cursor Rules

Modify `.cursorrules`:

- Replace Filebrowser API rules with PostgreSQL rules
- Add database query optimization guidelines
- Update data access patterns
- Add prepared statement requirements

### 9.3 Create Migration Guide

Create `docs/MIGRATION.md`:

- Step-by-step migration instructions
- Rollback procedures
- Testing checklist
- Common issues and solutions

## Phase 10: Testing & Validation

### 10.1 Local Testing

- Run migration script on development database
- Verify all pages load correctly
- Test search functionality
- Validate data integrity
- Check performance metrics

### 10.2 Production Deployment

- Backup existing data
- Run migration on production database
- Deploy updated application
- Monitor performance and errors
- Verify ISR and caching work correctly

## Deliverables Summary

1. ✅ **Database Schema**: `lib/db/schema.sql` with optimized indexes
2. ✅ **PostgreSQL Config**: Tuning parameters for 25M+ records
3. ✅ **PgBouncer Config**: `pgbouncer.ini` with connection pooling
4. ✅ **Database Client**: `lib/db/client.ts` with `pg` and pooling
5. ✅ **Query Layer**: `lib/db/queries.ts` with prepared statements
6. ✅ **Migration Scripts**: CSV import, validation, and seeding
7. ✅ **Admin API**: CRUD endpoints with authentication
8. ✅ **CSV Import API**: Bulk import via API endpoint
9. ✅ **Updated Data Layer**: Refactored `lib/data/db.ts`
10. ✅ **Environment Variables**: PostgreSQL connection strings
11. ✅ **Caching Strategy**: Database-aware caching with ISR
12. ✅ **Documentation**: Setup guides and migration instructions
13. ✅ **Cleanup**: Removed Filebrowser dependencies

## Performance Optimizations

- **Prepared Statements**: All queries use prepared statements
- **Batch Operations**: Insert/update in batches of 1000
- **Indexes**: Covering indexes for common query patterns
- **Connection Pooling**: PgBouncer for lightweight connections
- **Query Caching**: In-memory cache for hot data
- **Read Replicas**: Support for read replica routing (optional)
- **JSONB Indexes**: GiST indexes for flexible field queries
- **Partial Indexes**: For state/location filtering
- **EXPLAIN ANALYZE**: Query optimization during development

## Expected Performance

- Query response time: < 50ms for most queries
- Bulk import speed: ~10,000 records/second
- Concurrent connections: 1000+ via PgBouncer
- Database size: ~5-10GB for 25M records with indexes
- ISR revalidation: Same 1-year strategy, on-demand when needed

### To-dos

- [ ] Create PostgreSQL schema with tables for occupations, countries, states, locations, and optimized indexes
- [ ] Create PostgreSQL tuning configuration file for high-performance concurrent reads/writes
- [ ] Create PgBouncer configuration file with connection pooling settings
- [ ] Implement database client with pg library and connection pooling
- [ ] Create query functions with prepared statements for all data access patterns
- [ ] Build CSV to PostgreSQL import script with batch operations and error handling
- [ ] Create migration validation script to verify data integrity
- [ ] Implement admin API endpoints for CRUD operations with authentication
- [ ] Build bulk CSV import API endpoint with streaming support
- [ ] Replace lib/data/parse.ts with PostgreSQL-based data access layer
- [ ] Refactor optimized-parse.ts to use database queries instead of CSV parsing
- [ ] Update all page routes to use new database queries
- [ ] Implement database-aware caching strategy with ISR integration
- [ ] Update environment variables and create .env.local.example
- [ ] Remove Filebrowser client and deprecated CSV parsing files
- [ ] Update README, create PgBouncer setup guide, and migration documentation