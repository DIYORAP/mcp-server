import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { BaseTool } from './BaseTool';
import { FileSearchTool } from '../tools/FileSearchTool';

const tools: BaseTool[] = [
  new FileSearchTool(),

];

export function registerAllTools(server: McpServer): void {
  for (const tool of tools) {
    tool.register(server);
  }
  console.log('All tools registered successfully.');
}
