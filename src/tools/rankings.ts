import { AiiqClient } from '../client.js';
import { textResult, errorResult, type ToolResult } from './result.js';

interface Ranking {
  id: string;
  rankingName: string;
  rankingType: string;
  dimension?: string | null;
  direction: string;
  models: unknown[];
}

interface RankingsResponse {
  apiVersion?: string;
  rankings?: Ranking[];
}

export async function listRankings(client: AiiqClient): Promise<ToolResult> {
  const data = await client.get<RankingsResponse>('/api/rankings');
  const catalog = (data.rankings ?? []).map((r) => ({
    id: r.id,
    rankingName: r.rankingName,
    rankingType: r.rankingType,
    dimension: r.dimension ?? null,
    direction: r.direction,
  }));
  return textResult({ apiVersion: data.apiVersion, rankings: catalog });
}

export async function getRanking(client: AiiqClient, id: string): Promise<ToolResult> {
  const data = await client.get<RankingsResponse>('/api/rankings');
  const rankings = data.rankings ?? [];
  const match = rankings.find((r) => r.id === id);
  if (!match) {
    const ids = rankings.map((r) => r.id).join(', ');
    return errorResult(`Ranking "${id}" not found. Available ranking ids: ${ids}`);
  }
  return textResult(match);
}
