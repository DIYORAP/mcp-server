# MCP Server with File Search Tool

A Model Context Protocol (MCP) server implementation in Node.js using TypeScript. This server provides tools for AI models to interact with external systems, including a powerful file search capability.

## Features

- 🚀 **MCP Server**: Implements the Model Context Protocol for AI model integration
- 🔍 **File Search Tool**: Search for keywords within text files with line number results
- 🔧 **Question Tool**: A tool for asking freeform questions to a chatbot service
- 🛠️ **BaseTool Abstraction**: A simple abstraction for creating new tools with Zod-based schema validation
- 🌐 **HTTP & STDIO Transport**: Supports both HTTP and STDIO transport modes for the MCP server
- 📝 **TypeScript**: Full TypeScript support with strict type checking
- 🎯 **ESLint + Prettier**: Code quality and formatting tools
- 📦 **Modern Node.js**: ES2020+ features and modern JavaScript

## Prerequisites

- Node.js 18+ 
- npm or yarn

## Installation

1. **Clone and navigate to the project:**
   ```bash
   cd chatbot-mcp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

## Usage

### Development Mode
Run the server with hot reloading:
```bash
npm run dev
```

### Production Build
Build the TypeScript code:
```bash
npm run build
```

Run the compiled JavaScript:
```bash
npm start
```

### Testing with MCP Inspector
Test your tools using the MCP Inspector:
```bash
npx @modelcontextprotocol/inspector dist/index.js
```

### Code Quality
Lint the code:
```bash
npm run lint
```

Fix linting issues:
```bash
npm run lint:fix
```

Format code:
```bash
npm run format
```

## Project Structure

```
chatbot-mcp/
├── src/
│   ├── index.ts              # Main entry point
│   ├── server.ts             # MCP server setup
│   ├── tools/
│   │   ├── FileSearchTool.ts # File search tool implementation
│   │
│   └── utils/
│       ├── BaseTool.ts       # Base class for creating tools
│       └── toolRegistry.ts   # Utility to register all tools
├── sample.txt                # Sample file for testing file search
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── .env.example              # Environment variables template
└── README.md                 # This file
```

## MCP Tools

### 1. search_file (File Search Tool)
Searches for a specified keyword within a file and returns matching lines with line numbers.

**Input Schema:**
```typescript
{
  filepath: string,           // Path to the file to search
  keyword: string,            // Keyword to search for
  caseSensitive?: boolean     // Whether search is case-sensitive (default: false)
}
```

**Example Usage:**
```json
{
  "filepath": "sample.txt",
  "keyword": "MCP",
  "caseSensitive": false
}
```

**Example Output:**
```
Found 4 match(es) for keyword "MCP" in file: sample.txt

Line 1: Welcome to the MCP Server Documentation
Line 3: The Model Context Protocol enables seamless integration...
Line 5: MCP servers provide powerful capabilities...
Line 10: MCP makes it easy to build tool-enhanced AI applications.
```

**Features:**
- Case-insensitive search by default
- Returns line numbers with matching content
- Handles file not found errors gracefully
- Supports both absolute and relative file paths


## HTTP Endpoints

- `POST /mcp` - The primary endpoint for MCP requests when in HTTP mode
- `GET /` - A simple message indicating the server is running

## Configuration

Environment variables (set in `.env` file):

- `PORT` - The port for the MCP server to listen on (default: `5001`)
- `TRANSPORT_MODE` - The transport mode for the server, either `http` or `stdio` (default: `http`)
- `CHAT_SERVER_URL` - The URL for the external chat service used by the `questionTool`

## Development

### Adding New Tools

1. Create a new tool file in `src/tools/`
2. Extend the `BaseTool` class
3. Define the input schema using Zod
4. Implement the `execute` method
5. Register the tool in `src/utils/toolRegistry.ts`

### Example Tool Structure

```typescript
// src/tools/myNewTool.ts
import { BaseTool } from '../utils/BaseTool';
import { z } from 'zod';

export class MyNewTool extends BaseTool {
  constructor() {
    super({
      name: 'my_new_tool',
      title: 'My New Tool',
      description: 'A description for the new tool',
      inputSchema: {
        parameter1: z.string().describe('Description for parameter 1'),
        parameter2: z.number().optional().describe('Optional parameter')
      }
    });
  }

  async execute(input: any): Promise<any> {
    const { parameter1, parameter2 } = input;
    // Your tool's logic here
    return { success: true, result: `Received ${parameter1}` };
  }
}
```

### File Search Tool Implementation

The File Search Tool demonstrates:
- File system operations using Node.js `fs` module
- Error handling for missing files
- String manipulation and search algorithms
- Case-sensitive and case-insensitive search options
- Formatted output with line numbers

## Testing the File Search Tool

1. **Create a test file** (`sample.txt`):
   ```
   Welcome to the MCP Server Documentation
   This is a sample file for testing.
   The Model Context Protocol enables seamless integration.
   You can search for any keyword in this file.
   MCP servers provide powerful capabilities.
   ```

2. **Run the MCP Inspector**:
   ```bash
   npx @modelcontextprotocol/inspector dist/index.js
   ```

3. **Test with sample input**:
   - filepath: `sample.txt` or full path to the file
   - keyword: `MCP`
   - caseSensitive: `false`

4. **Verify the output** shows all matching lines with line numbers

## MCP Protocol

This server implements the Model Context Protocol, allowing AI models to:

- Discover available tools
- Call tools with structured inputs
- Receive structured outputs
- Handle errors gracefully

The server can be configured to use either `stdio` or `http` transport, making it flexible for different MCP client implementations.

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the `PORT` variable in your `.env` file
2. **TypeScript compilation errors**: Run `npm run lint` to see detailed errors
3. **File not found**: Use absolute paths or ensure relative paths are correct
4. **MCP connection issues**: Ensure the server is running and transport mode is correct

### Logs

The server provides detailed logging for debugging:
- MCP server initialization
- Tool execution and results
- File operations
- Error details with stack traces

## Use Cases

### File Search Tool Applications
- **Code Review**: Search for specific patterns or keywords in source code
- **Log Analysis**: Find error messages or specific events in log files
- **Documentation**: Locate specific information in text documents
- **Configuration**: Search for settings in configuration files
- **Data Processing**: Find specific entries in CSV or text data files

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Resources

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)
- [Node.js File System](https://nodejs.org/api/fs.html)
- [TypeScript](https://www.typescriptlang.org/)
- [Zod Schema Validation](https://zod.dev/)

## Assignment Completion

This project was created as part of the Ressl Assignment, implementing:
- ✅ MCP Server with proper architecture
- ✅ File Search Tool with keyword matching
- ✅ Zod-based schema validation
- ✅ Error handling and logging
- ✅ TypeScript best practices
- ✅ Tested with MCP Inspector

**Author**: Parthik Diyora  
**Date**: November 2, 2025
