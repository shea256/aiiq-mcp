import { AiiqClient, AiiqApiError } from '../client.js';
import { textResult, type ToolResult } from './result.js';

export async function compareModels(client: AiiqClient, ids: string[]): Promise<ToolResult> {
  const results = await Promise.all(
    ids.map(async (id) => {
      try {
        const model = await client.get(`/models/${encodeURIComponent(id)}`);
        return { id, found: true as const, model };
      } catch (err) {
        if (err instanceof AiiqApiError && err.status === 404) {
          return { id, found: false as const };
        }
        throw err;
      }
    }),
  );
  return textResult({
    compared: results.filter((r) => r.found).map((r) => (r as { model: unknown }).model),
    missing: results.filter((r) => !r.found).map((r) => r.id),
  });
}
