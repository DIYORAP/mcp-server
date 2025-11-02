import dotenv from 'dotenv';
import { startMCPServer } from './server';

dotenv.config();

async function main() {
  try {
    const mode = (process.env.TRANSPORT_MODE || 'http').toLowerCase() as 'stdio' | 'http';

    console.log(JSON.stringify({ status: 'starting', message: `Starting MCP Server in ${mode} mode...` }));

    await startMCPServer(mode);

    console.log(JSON.stringify({ status: 'success', message: `MCP Server started in ${mode} mode` }));

  } catch (error) {
    console.error(JSON.stringify({
      status: 'error',
      message: 'Failed to start MCP server',
      error: error instanceof Error ? error.message : String(error)
    }));
    process.exit(1);
  }
}

main();
