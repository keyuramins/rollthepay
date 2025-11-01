// lib/optimization-config.ts

// Optimization Configuration for RollThePay
// PostgreSQL-based architecture with efficient caching

export const OPTIMIZATION_CONFIG = {
  // Next.js ISR (Incremental Static Regeneration) settings
  NEXTJS: {
    REVALIDATE_DATA_DRIVEN: 3600, // 1 hour for data-driven pages (country, state, location, occupation)
    REVALIDATE_STATIC: 31536000, // 1 year for static pages (about, privacy, terms)
    DYNAMIC_PARAMS: false, // Ensure static generation only
    FORCE_STATIC: true,
  },

  // PostgreSQL connection and query optimization
  DATABASE: {
    QUERY_TIMEOUT: 30000, // 30 seconds
    CONNECTION_POOL_MAX: 20,
    CONNECTION_POOL_IDLE_TIMEOUT: 30000, // 30 seconds
    CONNECTION_POOL_CONNECTION_TIMEOUT: 10000, // 10 seconds
    BATCH_SIZE: 1000, // For bulk operations
  },

  // In-memory caching (short-lived for frequently accessed data)
  CACHE: {
    COUNTRY_LIST_TTL: 5 * 60 * 1000, // 5 minutes
    SEARCH_RESULTS_TTL: 2 * 60 * 1000, // 2 minutes
    MAX_CACHE_SIZE: 100, // Maximum number of cached items
    CLEANUP_INTERVAL: 300000, // 5 minutes
  },

  // Performance thresholds
  PERFORMANCE: {
    MAX_INITIAL_LOAD_TIME: 2000, // 2 seconds
    MAX_NAVIGATION_TIME: 500, // 500ms
    MAX_DATABASE_QUERY_TIME: 1000, // 1 second
  },

  // Error handling
  ERROR_HANDLING: {
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
    FALLBACK_STRATEGY: 'DATABASE_FIRST', // PostgreSQL is primary, no fallback needed
  },

  // Logging configuration
  LOGGING: {
    ENABLE_PERFORMANCE_METRICS: true,
    ENABLE_QUERY_LOGGING: false, // Set to true for debugging
    LOG_LEVEL: 'warn', // 'error' | 'warn' | 'info' | 'debug'
  },
} as const;

// Simple performance monitoring for PostgreSQL queries
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTimer(operation: string): () => void {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.recordMetric(operation, duration);
    };
  }

  recordMetric(operation: string, value: number): void {
    if (!OPTIMIZATION_CONFIG.LOGGING.ENABLE_PERFORMANCE_METRICS) return;
    
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, []);
    }
    this.metrics.get(operation)!.push(value);
  }

  getAverageTime(operation: string): number {
    const values = this.metrics.get(operation);
    if (!values || values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  getMetrics(): Record<string, number> {
    const result: Record<string, number> = {};
    for (const [operation, values] of this.metrics) {
      result[operation] = this.getAverageTime(operation);
    }
    return result;
  }

  clearMetrics(): void {
    this.metrics.clear();
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();
