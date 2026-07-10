# @aiiq/mcp

Model Context Protocol server for [AI IQ](https://www.aiiq.org) — query AI model IQ,
rankings, applied-capability domains, benchmarks, and methodology from any MCP client (Claude Code, etc.).

Read-only. Talks to the public AI IQ API over HTTPS; no API key required.

## Install

Requires Node.js 18+. No API key needed. Works in any MCP client.

**Claude Code** (one command):

```bash
claude mcp add aiiq -- npx -y @aiiq/mcp          # add --scope user for all projects
```

**Claude Desktop** — edit `claude_desktop_config.json` (Settings → Developer → Edit Config) and add:

```json
{
  "mcpServers": {
    "aiiq": { "command": "npx", "args": ["-y", "@aiiq/mcp"] }
  }
}
```

Then fully quit and reopen the app. (If Node is managed by nvm/asdf, use the absolute path to `npx`
as the `command`, since the desktop app doesn't inherit your shell PATH.)

**Cursor / Windsurf / other clients** — same JSON in the client's MCP config:

```json
{ "mcpServers": { "aiiq": { "command": "npx", "args": ["-y", "@aiiq/mcp"] } } }
```

## Tools

- `list_models` — all public models with IQ, 7 dimension scores, emotional reasoning, rank, cost
- `get_model` — full detail for one model (incl. per-benchmark results)
- `list_rankings` — available leaderboards with ids, names, model counts, and URLs
- `get_ranking` — ordered models for one ranking id
- `list_domains` — applied-capability domains and benchmark counts
- `get_domain` — model composite IQs and benchmark leaderboards for one domain
- `list_benchmarks` — benchmark catalog
- `get_methodology` — how AI IQ is computed
- `compare_models` — side-by-side detail for several models

## Config

- `AIIQ_API_BASE` — override the versioned API base URL (default `https://www.aiiq.org/api/v1`).
  A custom value must be the API root that contains paths such as `/models` and `/rankings`.

## Development

```bash
pnpm install
pnpm test
pnpm build
```

## License

MIT
