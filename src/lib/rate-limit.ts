/**
 * High-performance, memory-bounded sliding window rate limiter
 * Optimized for high-concurrency 10,000+ user traffic bursts.
 * Uses lazy eviction to prevent synchronous event-loop freezes.
 */

interface RateLimitRecord {
  timestamps: number[];
  lastSeen: number;
}

export interface RateLimitConfig {
  interval: number; // Window size in milliseconds
  maxRequests: number; // Max requests allowed per window
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp in seconds
  retryAfter: number; // Seconds until next token
}

class SlidingWindowRateLimiter {
  private cache = new Map<string, RateLimitRecord>();
  private readonly maxEntries = 20000;

  public check(key: string, config: RateLimitConfig): RateLimitResult {
    const now = Date.now();
    const windowStart = now - config.interval;

    let record = this.cache.get(key);

    if (!record) {
      // Lazy eviction if map exceeds maximum capacity
      if (this.cache.size >= this.maxEntries) {
        this.pruneOldest(1000);
      }
      record = { timestamps: [], lastSeen: now };
      this.cache.set(key, record);
    }

    // Filter out timestamps older than the active window
    record.timestamps = record.timestamps.filter((ts) => ts > windowStart);
    record.lastSeen = now;

    const requestCount = record.timestamps.length;
    const remaining = Math.max(0, config.maxRequests - requestCount);
    const reset = Math.ceil((now + config.interval) / 1000);

    if (requestCount >= config.maxRequests) {
      const oldestValid = record.timestamps[0] || now;
      const retryAfter = Math.max(1, Math.ceil((oldestValid + config.interval - now) / 1000));

      return {
        success: false,
        limit: config.maxRequests,
        remaining: 0,
        reset,
        retryAfter,
      };
    }

    record.timestamps.push(now);

    return {
      success: true,
      limit: config.maxRequests,
      remaining: remaining - 1,
      reset,
      retryAfter: 0,
    };
  }

  /**
   * Fast incremental eviction of stale keys
   */
  private pruneOldest(count: number): void {
    let pruned = 0;
    const iterator = this.cache.keys();
    while (pruned < count) {
      const next = iterator.next();
      if (next.done) break;
      this.cache.delete(next.value);
      pruned++;
    }
  }
}

const globalLimiter = new SlidingWindowRateLimiter();

export function rateLimit(
  identifier: string,
  options: { interval?: number; maxRequests?: number } = {}
): RateLimitResult {
  const interval = options.interval ?? 60 * 1000;
  const maxRequests = options.maxRequests ?? 60;

  return globalLimiter.check(identifier, { interval, maxRequests });
}
