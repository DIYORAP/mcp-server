import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express, { Request, Response } from 'express';
// @ts-ignore
import cors from 'cors';
import http from "http";
import { registerAllTools } from './utils/toolRegistry';

let serverInstance: McpServer | null = null;
let httpServer: http.Server | null = null;

function setupGracefulShutdown() {
  const shutdown = async () => {
    console.log('\n Shutting down gracefully...');

    if (httpServer) {
      httpServer.close(() => {
        console.log(' HTTP server closed');
      });
    }

    if (serverInstance) {
      console.log(' MCP server instance cleaned up');
    }

    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
  process.on('SIGUSR2', shutdown);
}

export async function startMCPServer(mode: 'stdio' | 'http' = 'stdio') {
  if (httpServer) {
    httpServer.close();
    httpServer = null;
  }

  const server = new McpServer({
    name: 'mcp-server',
    version: '1.0.0',
  });

  registerAllTools(server);
  serverInstance = server;

  setupGracefulShutdown();

  if (mode === 'stdio') {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log(" MCP Server running in STDIO mode");
    return server;
  }
  else if (mode === 'http') {
    const app = express();
    app.use(cors());
    app.use(express.json());

    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    await server.connect(transport);

    app.all('/mcp', (req: Request, res: Response) => {
      transport.handleRequest(req, res, req.body).catch((err) => {
        console.error("Transport error:", err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });
    });

    app.get('/', (_req, res) => res.send('MCP server is running'));

    const PORT = Number(process.env.PORT ?? 5001);

    httpServer = app.listen(PORT, () => {
      console.log(` MCP Server running in HTTP mode on http://localhost:${PORT}/mcp`);
    }).on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.error(` Port ${PORT} is already in use. Please kill existing processes or use a different port.`);
        process.exit(1);
      } else {
        console.error(' Server error:', err);
        process.exit(1);
      }
    });

    return server;
  }

  throw new Error(`Unsupported mode: ${mode}`);
}