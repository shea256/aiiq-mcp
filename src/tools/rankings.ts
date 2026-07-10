import { AiiqClient, AiiqApiError } from '../client.js';
import type { RankingDetail, RankingsResponse } from '../types.js';
import { textResult, errorResult, type ToolResult } from './result.js';

export async function listRankings(client: AiiqClient): Promise<ToolResult> {
  return textResult(await client.get<RankingsResponse>('/rankings'));
}

export async function getRanking(client: AiiqClient, id: string): Promise<ToolResult> {
  try {
    return textResult(await client.get<RankingDetail>(`/rankings/${encodeURIComponent(id)}`));
  } catch (err) {
    if (err instanceof AiiqApiError && err.status === 404) {
      const catalog = await client.get<RankingsResponse>('/rankings');
      const ids = catalog.rankings.map((ranking) => ranking.id).join(', ');
      return errorResult(`Ranking "${id}" not found. Available ranking ids: ${ids}`);
    }
    throw err;
  }
}
