import { describe, it, expect, vi } from 'vitest';
import { AiiqClient, AiiqApiError } from '../src/client.js';

function jsonResponse(body: unknown, status = 200) {
  return { ok: status >= 200 && status < 300, status, json: async () => body } as unknown as Response;
}

describe('AiiqClient', () => {
  it('sends aiiq-mcp User-Agent', async () => {
    const fetchImpl = vi.fn(async () => jsonResponse({ ok: 1 }));
    const c = new AiiqClient({ fetchImpl: fetchImpl as unknown as typeof fetch, version: '1.2.3' });
    await c.get('/models');
    expect(fetchImpl.mock.calls[0][0]).toBe('https://www.aiiq.org/api/v1/models');
    const init = fetchImpl.mock.calls[0][1] as RequestInit;
    expect((init.headers as Record<string, string>)['User-Agent']).toBe('aiiq-mcp/1.2.3');
  });

  it('caches within TTL', async () => {
    let t = 1000;
    const fetchImpl = vi.fn(async () => jsonResponse({ n: 1 }));
    const c = new AiiqClient({ fetchImpl: fetchImpl as unknown as typeof fetch, cacheTtlMs: 5000, now: () => t });
    await c.get('/models');
    await c.get('/models');
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('refetches after TTL expiry', async () => {
    let t = 1000;
    const fetchImpl = vi.fn(async () => jsonResponse({ n: 1 }));
    const c = new AiiqClient({ fetchImpl: fetchImpl as unknown as typeof fetch, cacheTtlMs: 5000, now: () => t });
    await c.get('/models');
    t = 7000;
    await c.get('/models');
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it('throws AiiqApiError with status on non-ok', async () => {
    const fetchImpl = vi.fn(async () => jsonResponse({ error: 'x' }, 404));
    const c = new AiiqClient({ fetchImpl: fetchImpl as unknown as typeof fetch });
    await expect(c.get('/models/nope')).rejects.toMatchObject({ name: 'AiiqApiError', status: 404 });
  });
});
