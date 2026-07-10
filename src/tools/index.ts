import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { AiiqClient } from '../client.js';
import { listModels, getModel } from './models.js';
import { listRankings, getRanking } from './rankings.js';
import { listBenchmarks, getMethodology } from './catalog.js';
import { compareModels } from './compare.js';
import { getDomain, listDomains } from './domains.js';

export function registerTools(server: McpServer, client: AiiqClient): void {
  server.registerTool(
    'list_models',
    {
      title: 'List models',
      description:
        'All public AI models with IQ, the 7 dimension scores, emotional reasoning, rank, and cost.',
      inputSchema: {},
    },
    () => listModels(client),
  );

  server.registerTool(
    'get_model',
    {
      title: 'Get model detail',
      description:
        'Full detail for one model by id/name, including per-benchmark results and dimension coverage.',
      inputSchema: { id: z.string().describe("Model id or name, e.g. 'gpt-5.5'") },
    },
    ({ id }) => getModel(client, id),
  );

  server.registerTool(
    'list_rankings',
    {
      title: 'List rankings',
      description:
        'Available leaderboards: composite IQ, effective cost, per-dimension, and per-benchmark, with model counts and URLs.',
      inputSchema: {},
    },
    () => listRankings(client),
  );

  server.registerTool(
    'list_domains',
    {
      title: 'List domains',
      description: 'Applied-capability domains with benchmark counts and URLs.',
      inputSchema: {},
    },
    () => listDomains(client),
  );

  server.registerTool(
    'get_domain',
    {
      title: 'Get domain detail',
      description: 'Composite model IQs and benchmark leaderboards for one applied-capability domain.',
      inputSchema: { slug: z.string().describe("Domain slug, e.g. 'cybersecurity'") },
    },
    ({ slug }) => getDomain(client, slug),
  );

  server.registerTool(
    'get_ranking',
    {
      title: 'Get ranking',
      description: 'The ordered models for one ranking id (from list_rankings).',
      inputSchema: { id: z.string().describe("Ranking id, e.g. 'composite-iq' or 'coding-iq'") },
    },
    ({ id }) => getRanking(client, id),
  );

  server.registerTool(
    'list_benchmarks',
    {
      title: 'List benchmarks',
      description: 'Benchmark catalog with descriptions, dimensions, directions, and units.',
      inputSchema: {},
    },
    () => listBenchmarks(client),
  );

  server.registerTool(
    'get_methodology',
    {
      title: 'Get methodology',
      description: 'How AI IQ is computed (methodology version + summary).',
      inputSchema: {},
    },
    () => getMethodology(client),
  );

  server.registerTool(
    'compare_models',
    {
      title: 'Compare models',
      description:
        'Side-by-side detail for several models by id/name. Unknown ids are reported, not fatal.',
      inputSchema: { ids: z.array(z.string()).min(2).describe('Two or more model ids/names to compare') },
    },
    ({ ids }) => compareModels(client, ids),
  );
}
