import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z, ZodRawShape } from 'zod';

export interface ToolConfig {
  name: string;
  title: string;
  description: string;
  inputSchema: ZodRawShape;
}

export abstract class BaseTool {
  protected config: ToolConfig;

  constructor(config: ToolConfig) {
    this.config = config;
  }

  /**
   * Execute the tool with the given input
   */
  abstract execute(input: any): Promise<any>;

  /**
   * Register this tool with the MCP server
   */
  register(server: McpServer): void {
    server.registerTool(this.config.name, {
      title: this.config.title,
      description: this.config.description,
      inputSchema: this.config.inputSchema
    }, async (args: any) => {
      try {
        const result = await this.execute(args);
        return {
          content: [
            {
              type: 'text',
              text: typeof result === 'string' ? result : JSON.stringify(result),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    });
  }

  /**
   * Get tool configuration
   */
  getConfig(): ToolConfig {
    return this.config;
  }
}
