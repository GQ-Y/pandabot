/**
 * 余额监控系统 - 缓存实现
 * 基于内存的余额信息缓存,带过期时间管理
 */

import type { BalanceCache, BalanceInfo } from "./types.js";

export interface BalanceCacheOptions {
  /** 缓存过期时间(秒),默认 300 秒(5分钟) */
  expirySeconds?: number;
}

interface CacheEntry {
  balance: BalanceInfo;
  expiresAt: number;
}

/**
 * 内存缓存实现
 */
export class InMemoryBalanceCache implements BalanceCache {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly expiryMs: number;

  constructor(options: BalanceCacheOptions = {}) {
    this.expiryMs = (options.expirySeconds ?? 300) * 1000;
  }

  async get(provider: string): Promise<BalanceInfo | null> {
    const entry = this.cache.get(provider);
    if (!entry) return null;

    // 检查是否过期
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(provider);
      return null;
    }

    return entry.balance;
  }

  async set(provider: string, balance: BalanceInfo): Promise<void> {
    this.cache.set(provider, {
      balance,
      expiresAt: Date.now() + this.expiryMs,
    });
  }

  async clear(provider: string): Promise<void> {
    this.cache.delete(provider);
  }

  async clearAll(): Promise<void> {
    this.cache.clear();
  }

  async getAll(): Promise<Map<string, BalanceInfo>> {
    const result = new Map<string, BalanceInfo>();
    const now = Date.now();

    // 清理过期条目并返回有效条目
    for (const [provider, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(provider);
      } else {
        result.set(provider, entry.balance);
      }
    }

    return result;
  }

  /** 清理所有过期条目 */
  cleanup(): void {
    const now = Date.now();
    for (const [provider, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(provider);
      }
    }
  }
}
