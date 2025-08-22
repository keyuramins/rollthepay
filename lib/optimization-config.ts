// Optimization Configuration for RollThePay
// This file contains all the performance and caching settings

export const OPTIMIZATION_CONFIG = {
  // Cache durations (in milliseconds)
  CACHE_DURATIONS: {
    DATASET: 31536000 * 1000, // 1 year
    PREFETCH: 31536000 * 1000, // 1 year
    ROUTE: 31536000 * 1000, // 1 year
    METADATA: 31536000 * 1000, // 1 year
  },

  // Prefetch settings
  PREFETCH: {
    ENABLED: true,
    AGGRESSIVE: true,
    ON_MOUNT: true,
    ON_HOVER: true,
    ON_FOCUS: true,
    DELAY: 150, // milliseconds
    BATCH_SIZE: 7, // number of routes to prefetch simultaneously
    PRIORITY_ROUTES: [
      '/', // Homepage
      '/about', // About page
    ],
  },

  // Data access optimization
  DATA_ACCESS: {
    USE_PREFETCH_CACHE: true,
    FALLBACK_TO_API: true,
    PARALLEL_FETCHING: true,
    MAX_CONCURRENT_REQUESTS: 5,
  },

  // Next.js specific optimizations
  NEXTJS: {
    REVALIDATE: 31536000, // 1 year in seconds
    DYNAMIC_PARAMS: false, // Ensure static generation only
    FORCE_STATIC: true,
    PREFETCH: true,
  },

  // Performance thresholds
  PERFORMANCE: {
    MAX_INITIAL_LOAD_TIME: 2000, // 2 seconds
    MAX_NAVIGATION_TIME: 500, // 500ms
    MAX_DATA_FETCH_TIME: 1000, // 1 second
  },

  // Memory management
  MEMORY: {
    MAX_CACHE_SIZE: 1000, // Maximum number of cached items
    CLEANUP_INTERVAL: 300000, // 5 minutes
    EVICTION_POLICY: 'LRU', // Least Recently Used
  },

  // Error handling
  ERROR_HANDLING: {
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
    FALLBACK_STRATEGY: 'CACHE_FIRST',
  },

  // Monitoring and analytics
  MONITORING: {
    ENABLE_PERFORMANCE_METRICS: true,
    ENABLE_CACHE_STATS: true,
    ENABLE_ERROR_TRACKING: true,
    LOG_LEVEL: 'info', // 'debug' | 'info' | 'warn' | 'error'
  },
} as const;

// Performance monitoring utilities
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

// Cache management utilities
export class CacheManager {
  private static instance: CacheManager;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  set<T>(key: string, data: T, ttl: number = OPTIMIZATION_CONFIG.CACHE_DURATIONS.DATASET): void {
    // Implement LRU eviction if cache is full
    if (this.cache.size >= OPTIMIZATION_CONFIG.MEMORY.MAX_CACHE_SIZE) {
      this.evictOldest();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, item] of this.cache) {
      if (item.timestamp < oldestTime) {
        oldestTime = item.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  // Cleanup expired items
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Export singleton instances
export const performanceMonitor = PerformanceMonitor.getInstance();
export const cacheManager = CacheManager.getInstance();
