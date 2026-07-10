import { AiiqApiError, AiiqClient } from '../client.js';
import type { DomainDetail, DomainsResponse } from '../types.js';
import { errorResult, textResult, type ToolResult } from './result.js';

export async function listDomains(client: AiiqClient): Promise<ToolResult> {
  return textResult(await client.get<DomainsResponse>('/domains'));
}

export async function getDomain(client: AiiqClient, slug: string): Promise<ToolResult> {
  try {
    return textResult(await client.get<DomainDetail>(`/domains/${encodeURIComponent(slug)}`));
  } catch (err) {
    if (err instanceof AiiqApiError && err.status === 404) {
      const catalog = await client.get<DomainsResponse>('/domains');
      const slugs = catalog.domains.map((domain) => domain.id).join(', ');
      return errorResult(`Domain "${slug}" not found. Available domain slugs: ${slugs}`);
    }
    throw err;
  }
}
