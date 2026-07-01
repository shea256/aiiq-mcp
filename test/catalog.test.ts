import { describe, it, expect } from 'vitest';
import { AiiqClient } from '../src/client.js';
import { listBenchmarks, getMethodology } from '../src/tools/catalog.js';

describe('catalog tools', () => {
  it('listBenchmarks passes through /api/benchmarks', async () => {
    const client = { get: async () => ({ benchmarks: [{ id: 'gpqa' }] }) } as unknown as AiiqClient;
    const res = await listBenchmarks(client);
    expect(JSON.parse(res.content[0].text).benchmarks[0].id).toBe('gpqa');
  });

  it('getMethodology passes through /api/methodology', async () => {
    const client = { get: async () => ({ methodologyVersion: '2026-06' }) } as unknown as AiiqClient;
    const res = await getMethodology(client);
    expect(JSON.parse(res.content[0].text).methodologyVersion).toBe('2026-06');
  });
});
