import { describe, it, expect } from 'vitest';
import { AiiqApiError, AiiqClient } from '../src/client.js';
import { listRankings, getRanking } from '../src/tools/rankings.js';

const CATALOG = {
  apiVersion: 'v1',
  rankings: [
    { id: 'composite-iq', rankingName: 'Composite IQ', rankingType: 'derived', dimension: null, direction: 'higher_is_better', modelCount: 2, url: 'https://www.aiiq.org/rankings/composite-iq' },
    { id: 'frontend-engineering-iq', rankingName: 'Frontend Engineering IQ', rankingType: 'dimension', dimension: 'frontend-engineering', direction: 'higher_is_better', modelCount: 1, url: 'https://www.aiiq.org/rankings/frontend-engineering-iq' },
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

describe('rankings tools', () => {
  it('listRankings passes through the catalog including model counts and URLs', async () => {
    const res = await listRankings(fakeClient({ '/rankings': CATALOG }));
    expect(JSON.parse(res.content[0].text)).toEqual(CATALOG);
  });

  it('getRanking fetches one ranking directly with its models', async () => {
    const detail = { id: 'composite-iq', rankingName: 'Composite IQ', rankingType: 'derived', direction: 'higher_is_better', models: [{ id: 'a', rank: 1 }] };
    const res = await getRanking(fakeClient({ '/rankings/composite-iq': detail }), 'composite-iq');
    expect(JSON.parse(res.content[0].text)).toEqual(detail);
  });

  it('getRanking fetches the catalog after a 404 and lists available ids', async () => {
    const client = fakeClient({ '/rankings': CATALOG }, { '/rankings/bogus': 404 });
    const res = await getRanking(client, 'bogus');
    expect(res.isError).toBe(true);
    expect(res.content[0].text).toMatch(/composite-iq/);
    expect(res.content[0].text).toMatch(/frontend-engineering-iq/);
  });
});
