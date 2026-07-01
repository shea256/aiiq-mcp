import { AiiqClient } from '../client.js';
import { textResult, type ToolResult } from './result.js';

export async function listBenchmarks(client: AiiqClient): Promise<ToolResult> {
  return textResult(await client.get('/api/benchmarks'));
}

export async function getMethodology(client: AiiqClient): Promise<ToolResult> {
  return textResult(await client.get('/api/methodology'));
}
