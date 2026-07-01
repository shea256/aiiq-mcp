export class AiiqApiError extends Error {
  constructor(message: string, readonly status: number, readonly path: string) {
    super(message);
    this.name = 'AiiqApiError';
  }
}

export interface AiiqClientOptions {
  baseUrl?: string;
  fetchImpl?: typeof fetch;
  cacheTtlMs?: number;
  now?: () => number;
  version?: string;
}

interface CacheEntry {
  value: unknown;
  expires: number;
}

const DEFAULT_BASE = 'https://www.aiiq.org';
const DEFAULT_TTL_MS = 5 * 60 * 1000;

export class AiiqClient {
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;
  private readonly ttl: number;
  private readonly now: () => number;
  private readonly userAgent: string;
  private readonly cache = new Map<string, CacheEntry>();

  constructor(opts: AiiqClientOptions = {}) {
    const base = opts.baseUrl ?? process.env.AIIQ_API_BASE ?? DEFAULT_BASE;
    this.baseUrl = base.replace(/\/$/, '');
    this.fetchImpl = opts.fetchImpl ?? fetch;
    this.ttl = opts.cacheTtlMs ?? DEFAULT_TTL_MS;
    this.now = opts.now ?? (() => Date.now());
    this.userAgent = `aiiq-mcp/${opts.version ?? '0.0.0'}`;
  }

  async get<T>(path: string): Promise<T> {
    const cached = this.cache.get(path);
    if (cached && cached.expires > this.now()) return cached.value as T;

    const res = await this.fetchImpl(`${this.baseUrl}${path}`, {
      headers: { 'User-Agent': this.userAgent, Accept: 'application/json' },
    });
    if (!res.ok) {
      throw new AiiqApiError(`AI IQ API returned ${res.status} for ${path}`, res.status, path);
    }
    const value = (await res.json()) as T;
    this.cache.set(path, { value, expires: this.now() + this.ttl });
    return value;
  }
}
