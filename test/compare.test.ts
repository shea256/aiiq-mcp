import { describe, it, expect } from 'vitest';
import { AiiqClient, AiiqApiError } from '../src/client.js';
import { compareModels } from '../src/tools/compare.js';

function fakeClient(routes: Record<string, unknown>, errors: Record<string, number> = {}): AiiqClient {
  return {
    get: async (path: string) => {
      if (errors[path]) throw new AiiqApiError('err', errors[path], path);
      if (path in routes) return routes[path];
      throw new AiiqApiError('not found', 404, path);
    },
  } as unknown as AiiqClient;
}

describe('compareModels', () => {
  it('separates found models from missing ids', async () => {
    const client = fakeClient(
      { '/models/a': { id: 'a', iq: 130 } },
      { '/models/b': 404 },
    );
    const res = await compareModels(client, ['a', 'b']);
    const parsed = JSON.parse(res.content[0].text);
    expect(parsed.compared).toHaveLength(1);
    expect(parsed.compared[0].id).toBe('a');
    expect(parsed.missing).toEqual(['b']);
  });
});
