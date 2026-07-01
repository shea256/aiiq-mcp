import { describe, it, expect } from 'vitest';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { AiiqClient } from '../src/client.js';
import { registerTools } from '../src/tools/index.js';

describe('registerTools', () => {
  it('registers all seven tools', () => {
    const names: string[] = [];
    const fakeServer = { registerTool: (name: string) => { names.push(name); } };
    registerTools(fakeServer as unknown as McpServer, {} as unknown as AiiqClient);
    expect(names.sort()).toEqual([
      'compare_models', 'get_methodology', 'get_model', 'get_ranking',
      'list_benchmarks', 'list_models', 'list_rankings',
    ]);
  });
});
