import 'dotenv/config';
import { Pool, PoolConfig } from 'pg';

const poolConfig: PoolConfig = {
  // Use PgBouncer URL for connection pooling
  connectionString: process.env.PGBOUNCER_URL || process.env.DATABASE_URL,
  max: parseInt(process.env.PGPOOL_MAX || '20'),
  idleTimeoutMillis: parseInt(process.env.PGPOOL_IDLE_TIMEOUT || '30000'),
  connectionTimeoutMillis: parseInt(process.env.PGPOOL_CONNECTION_TIMEOUT || '10000'),
  query_timeout: 30000, // 30 second query timeout (PgBouncer handles pooling)
  // PgBouncer specific settings
  application_name: 'rollthepay-app',
  // Note: statement_timeout is not supported by PgBouncer, removed
};

// Only initialize pool when needed (skip during build)
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || process.env.NODE_ENV === 'production' && process.env.SKIP_DB_DURING_BUILD === 'true';

const isDev = process.env.NODE_ENV !== 'production';

let _pool: Pool | null = null;

// In dev, attach the pool to globalThis to survive HMR reloads
declare global {
  // eslint-disable-next-line no-var
  var __rollthepay_pg_pool__: Pool | undefined;
}

// Initialize pool based on environment
function initializePool(): Pool | null {
  if (process.env.SKIP_DB_DURING_BUILD === 'true' && isBuildTime) return null;

  if (isDev) {
    if (!global.__rollthepay_pg_pool__) {
      global.__rollthepay_pg_pool__ = new Pool(poolConfig);
    }
    _pool = global.__rollthepay_pg_pool__;
  } else {
    // Production: just create a new pool normally
    _pool = new Pool(poolConfig);
  }

  return _pool;
}

export const pool: Pool | null = initializePool();

let poolEnded = false;

async function closePool() {
  if (!poolEnded && _pool && !isDev) {
    console.log('Closing database pool...');
    await _pool.end();
    poolEnded = true;
  }
}

if (!isDev) {
  process.on('SIGTERM', closePool);
  process.on('SIGINT', closePool);
}

// Helper to ensure pool is initialized
export function requirePool(): Pool {
  if (!pool) {
    throw new Error('Database pool not initialized');
  }
  return pool;
}

// Health check
export async function checkConnection(): Promise<boolean> {
  if (!pool) {
    console.log('⚠️ Database pool not initialized (SKIP_DB_DURING_BUILD=true)');
    return false;
  }
  
  try {
    const result = await pool.query('SELECT NOW()');
    return !!result.rows[0];
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

// Test connection with detailed error info
export async function testConnection(): Promise<{ success: boolean; error?: string; details?: any }> {
  if (!pool) {
    return {
      success: false,
      error: 'Database pool not initialized (SKIP_DB_DURING_BUILD=true)',
      details: { poolInitialized: false }
    };
  }
  
  try {
    const start = Date.now();
    const result = await pool.query('SELECT NOW() as current_time, version() as pg_version');
    const duration = Date.now() - start;
    
    return {
      success: true,
      details: {
        currentTime: result.rows[0].current_time,
        pgVersion: result.rows[0].pg_version,
        connectionDuration: `${duration}ms`,
        poolConfig: {
          max: poolConfig.max,
          idleTimeout: poolConfig.idleTimeoutMillis,
          connectionTimeout: poolConfig.connectionTimeoutMillis
        }
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: {
        poolConfig,
        env: {
          DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
          PGPOOL_MAX: process.env.PGPOOL_MAX,
          PGPOOL_IDLE_TIMEOUT: process.env.PGPOOL_IDLE_TIMEOUT,
          PGPOOL_CONNECTION_TIMEOUT: process.env.PGPOOL_CONNECTION_TIMEOUT
        }
      }
    };
  }
}

// Get pool statistics
export function getPoolStats() {
  if (!pool) {
    return {
      totalCount: 0,
      idleCount: 0,
      waitingCount: 0,
      poolInitialized: false
    };
  }
  
  return {
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount,
    poolInitialized: true
  };
}

export default pool;
