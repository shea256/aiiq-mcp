#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { AiiqClient } from './client.js';
import { registerTools } from './tools/index.js';

const here = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(resolve(here, '../package.json'), 'utf8')) as { version: string };

const client = new AiiqClient({ version: pkg.version });
const server = new McpServer({ name: 'aiiq-mcp', version: pkg.version });
registerTools(server, client);

const transport = new StdioServerTransport();
await server.connect(transport);
