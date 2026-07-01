export type ToolResult = {
  content: { type: 'text'; text: string }[];
  isError?: boolean;
};

export function textResult(data: unknown): ToolResult {
  return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
}

export function errorResult(message: string): ToolResult {
  return { content: [{ type: 'text', text: message }], isError: true };
}
