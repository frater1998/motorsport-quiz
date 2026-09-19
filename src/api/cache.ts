// Smart Cache Layer with TTL and SessionStorage persistence

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // in milliseconds
}

class CacheManager {
  private memoryCache = new Map<string, CacheEntry<unknown>>();

  public get<T>(key: string): T | null {
    // 1. Check memory cache
    const memEntry = this.memoryCache.get(key) as CacheEntry<T> | undefined;
    if (memEntry) {
      if (Date.now() - memEntry.timestamp < memEntry.ttl) {
        return memEntry.data;
      }
      this.memoryCache.delete(key);
    }

    // 2. Check sessionStorage
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const item = sessionStorage.getItem(`f1_quiz_${key}`);
        if (item) {
          const parsed = JSON.parse(item) as CacheEntry<T>;
          if (Date.now() - parsed.timestamp < parsed.ttl) {
            this.memoryCache.set(key, parsed);
            return parsed.data;
          }
          sessionStorage.removeItem(`f1_quiz_${key}`);
        }
      }
    } catch {
      // Storage quota or privacy mode
    }

    return null;
  }

  public set<T>(key: string, data: T, ttl: number = 1000 * 60 * 60): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl
    };

    this.memoryCache.set(key, entry as CacheEntry<unknown>);

    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.setItem(`f1_quiz_${key}`, JSON.stringify(entry));
      }
    } catch {
      // Storage quota exceeded or disabled
    }
  }

  public clear(): void {
    this.memoryCache.clear();
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const keys = Object.keys(sessionStorage).filter(k => k.startsWith('f1_quiz_'));
        keys.forEach(k => sessionStorage.removeItem(k));
      }
    } catch {
      // Ignore
    }
  }
}

export const apiCache = new CacheManager();
