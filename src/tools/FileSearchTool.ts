import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';
import { BaseTool } from '../utils/BaseTool';

export class FileSearchTool extends BaseTool {
    constructor() {
        super({
            name: 'search_file',
            title: 'Search File',
            description: 'Search for a keyword in a specified file and return matching lines with line numbers',
            inputSchema: {
                filepath: z.string().describe('Path to the file to search'),
                keyword: z.string().describe('Keyword to search for in the file'),
                caseSensitive: z.boolean().optional().describe('Whether the search should be case-sensitive (default: false)')
            }
        });
    }

    async execute(input: any): Promise<string> {
        const { filepath, keyword, caseSensitive = false } = input;

        if (!filepath || typeof filepath !== 'string') {
            throw new Error('filepath is required and must be a string');
        }

        if (!keyword || typeof keyword !== 'string') {
            throw new Error('keyword is required and must be a string');
        }

        if (!fs.existsSync(filepath)) {
            throw new Error(`File not found: ${filepath}`);
        }

        let content: string;
        try {
            content = fs.readFileSync(filepath, 'utf-8');
        } catch (error) {
            throw new Error(`Failed to read file: ${error instanceof Error ? error.message : String(error)}`);
        }

        const lines = content.split('\n');
        const matches: { lineNumber: number; content: string }[] = [];

        const searchKeyword = caseSensitive ? keyword : keyword.toLowerCase();

        lines.forEach((line, index) => {
            const searchLine = caseSensitive ? line : line.toLowerCase();
            if (searchLine.includes(searchKeyword)) {
                matches.push({
                    lineNumber: index + 1,
                    content: line.trim()
                });
            }
        });

        if (matches.length === 0) {
            return `No matches found for keyword "${keyword}" in file: ${filepath}`;
        }

        const resultLines = [
            `Found ${matches.length} match(es) for keyword "${keyword}" in file: ${filepath}`,
            '',
            ...matches.map(match => `Line ${match.lineNumber}: ${match.content}`)
        ];

        return resultLines.join('\n');
    }
}