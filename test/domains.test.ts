import { describe, expect, it } from 'vitest';
import { AiiqApiError, AiiqClient } from '../src/client.js';
import { getDomain, listDomains } from '../src/tools/domains.js';

const CATALOG = {
  apiVersion: 'v1',
  domains: [
    { id: 'cybersecurity', name: 'Cybersecurity', benchmarkCount: 2, updatedAt: '2026-07-10T00:00:00Z', url: 'https://www.aiiq.org/domains/cybersecurity' },
    { id: 'bio', name: 'Bio', benchmarkCount: 1, updatedAt: '2026-07-10T00:00:00Z', url: 'https://www.aiiq.org/domains/bio' },
  ],
};

function fakeClient(routes: Record<string, unknown>, errors: Record<string, number> = {}): AiiqClient {
  return {
    get: async (path: string) => {
      if (errors[path]) throw new AiiqApiError('err', errors[path], path);
      return routes[path];
    },
  } as unknown as AiiqClient;
}

describe('domain tools', () => {
  it('listDomains passes through the domain catalog', async () => {
    const res = await listDomains(fakeClient({ '/domains': CATALOG }));
    expect(JSON.parse(res.content[0].text)).toEqual(CATALOG);
  });

  it('getDomain returns domain model composites and benchmark results', async () => {
    const detail = { id: 'cybersecurity', name: 'Cybersecurity', models: [{ model: 'gpt-5.5', compositeIQ: 147 }], benchmarks: [{ id: 'cybench', results: [{ model: 'gpt-5.5', harness: null, score: 0.9 }] }] };
    const res = await getDomain(fakeClient({ '/domains/cybersecurity': detail }), 'cybersecurity');
    expect(JSON.parse(res.content[0].text)).toEqual(detail);
  });

  it('getDomain fetches the catalog after a 404 and lists available slugs', async () => {
    const client = fakeClient({ '/domains': CATALOG }, { '/domains/unknown': 404 });
    const res = await getDomain(client, 'unknown');
    expect(res.isError).toBe(true);
    expect(res.content[0].text).toContain('cybersecurity, bio');
  });
});
