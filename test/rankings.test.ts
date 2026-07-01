import { describe, it, expect } from 'vitest';
import { AiiqClient } from '../src/client.js';
import { listRankings, getRanking } from '../src/tools/rankings.js';

const RANKINGS = {
  apiVersion: '1',
  rankings: [
    { id: 'composite-iq', rankingName: 'Composite IQ', rankingType: 'derived', direction: 'higher_is_better', models: [{ id: 'a', rank: 1 }] },
    { id: 'coding-iq', rankingName: 'Coding IQ', rankingType: 'dimension', dimension: 'coding', direction: 'higher_is_better', models: [{ id: 'b', rank: 1 }] },
  ],
};

function fakeClient(): AiiqClient {
  return { get: async () => RANKINGS } as unknown as AiiqClient;
}

describe('rankings tools', () => {
  it('listRankings returns catalog without model lists', async () => {
    const res = await listRankings(fakeClient());
    const parsed = JSON.parse(res.content[0].text);
    expect(parsed.rankings).toHaveLength(2);
    expect(parsed.rankings[0]).toEqual({
      id: 'composite-iq', rankingName: 'Composite IQ', rankingType: 'derived', dimension: null, direction: 'higher_is_better',
    });
    expect(parsed.rankings[0].models).toBeUndefined();
  });

  it('getRanking returns one ranking with its models', async () => {
    const res = await getRanking(fakeClient(), 'coding-iq');
    const parsed = JSON.parse(res.content[0].text);
    expect(parsed.id).toBe('coding-iq');
    expect(parsed.models[0].id).toBe('b');
  });

  it('getRanking errors with available ids when unknown', async () => {
    const res = await getRanking(fakeClient(), 'bogus');
    expect(res.isError).toBe(true);
    expect(res.content[0].text).toMatch(/composite-iq/);
    expect(res.content[0].text).toMatch(/coding-iq/);
  });
});
