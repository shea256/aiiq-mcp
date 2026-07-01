import { AiiqClient, AiiqApiError } from '../client.js';
import { textResult, errorResult, type ToolResult } from './result.js';

export async function listModels(client: AiiqClient): Promise<ToolResult> {
  return textResult(await client.get('/api/models'));
}

export async function getModel(client: AiiqClient, id: string): Promise<ToolResult> {
  try {
    return textResult(await client.get(`/api/models/${encodeURIComponent(id)}`));
  } catch (err) {
    if (err instanceof AiiqApiError && err.status === 404) {
      return errorResult(`Model "${id}" not found. Use list_models to see available ids.`);
    }
    throw err;
  }
}
