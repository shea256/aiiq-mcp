import { describe, it, expect } from 'vitest';
import { AiiqClient, AiiqApiError } from '../src/client.js';
import { listModels, getModel } from '../src/tools/models.js';

function fakeClient(routes: Record<string, unknown>, errors: Record<string, number> = {}): AiiqClient {
  return {
    get: async (path: string) => {
      if (errors[path]) throw new AiiqApiError('err', errors[path], path);
      if (path in routes) return routes[path];
      throw new AiiqApiError('not found', 404, path);
    },
  } as unknown as AiiqClient;
}

describe('models tools', () => {
  it('listModels returns the models payload as text', async () => {
    const client = fakeClient({ '/models': { models: [{ id: 'gpt-5.5' }] } });
    const res = await listModels(client);
    expect(res.isError).toBeUndefined();
    expect(JSON.parse(res.content[0].text).models[0].id).toBe('gpt-5.5');
  });

  it('getModel returns detail for a known id', async () => {
    const client = fakeClient({ '/models/gpt-5.5': { id: 'gpt-5.5', iq: 140 } });
    const res = await getModel(client, 'gpt-5.5');
    expect(JSON.parse(res.content[0].text).iq).toBe(140);
  });

  it('getModel returns a friendly error on 404', async () => {
    const client = fakeClient({}, { '/models/nope': 404 });
    const res = await getModel(client, 'nope');
    expect(res.isError).toBe(true);
    expect(res.content[0].text).toMatch(/not found/i);
  });
});
