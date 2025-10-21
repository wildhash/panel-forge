/**
 * Simple in-memory rate limiter for API routes
 * In production, use Redis or a similar service
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests in the time window
}

export function rateLimit(identifier: string, config: RateLimitConfig): boolean {
  const now = Date.now();
  const key = identifier;

  // Clean up old entries periodically
  if (Math.random() < 0.01) {
    Object.keys(store).forEach((k) => {
      if (store[k].resetTime < now) {
        delete store[k];
      }
    });
  }

  // Initialize or get existing entry
  if (!store[key] || store[key].resetTime < now) {
    store[key] = {
      count: 1,
      resetTime: now + config.interval,
    };
    return true;
  }

  // Check if limit exceeded
  if (store[key].count >= config.maxRequests) {
    return false;
  }

  // Increment counter
  store[key].count++;
  return true;
}

export function getRateLimitHeaders(identifier: string, config: RateLimitConfig) {
  const entry = store[identifier];
  if (!entry) {
    return {
      "X-RateLimit-Limit": config.maxRequests.toString(),
      "X-RateLimit-Remaining": config.maxRequests.toString(),
      "X-RateLimit-Reset": (Date.now() + config.interval).toString(),
    };
  }

  const remaining = Math.max(0, config.maxRequests - entry.count);
  return {
    "X-RateLimit-Limit": config.maxRequests.toString(),
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Reset": entry.resetTime.toString(),
  };
}
