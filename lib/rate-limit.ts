// Small in-memory limiter. On serverless every instance has its own memory, so this is a
// best-effort brake against bursts and repeats, not a hard guarantee.
export function createRateLimiter(max: number, windowMs: number) {
  const hits = new Map<string, { count: number; resetAt: number }>();

  return function allow(key: string, now: number = Date.now()): boolean {
    if (hits.size > 2000) {
      for (const [k, v] of hits) if (now >= v.resetAt) hits.delete(k);
    }

    const entry = hits.get(key);
    if (!entry || now >= entry.resetAt) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }
    if (entry.count >= max) return false;
    entry.count += 1;
    return true;
  };
}
