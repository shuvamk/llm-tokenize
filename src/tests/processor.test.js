import { describe, it, expect } from 'vitest';
import { processDirectory } from '../processor.js';
import path from 'path';
import fs from 'fs/promises';
import os from 'os';

describe('processDirectory', () => {
  it('should process a directory and generate markdown', async () => {
    // Create a temporary test directory
    const testDir = path.join(os.tmpdir(), 'llm-tokenize-test-' + Date.now());
    await fs.mkdir(testDir);

    try {
      // Create test files
      await fs.writeFile(
        path.join(testDir, 'test.js'),
        'console.log("Hello World!");'
      );
      await fs.writeFile(
        path.join(testDir, 'test.md'),
        '# Test Markdown'
      );

      const { markdown, tokenCount } = await processDirectory(testDir, 'gpt-4');

      // Basic assertions
      expect(markdown).toContain('# Codebase Documentation');
      expect(markdown).toContain('test.js');
      expect(markdown).toContain('test.md');
      expect(tokenCount).toBeGreaterThan(0);

    } finally {
      // Cleanup
      await fs.rm(testDir, { recursive: true, force: true });
    }
  });

  it('should handle empty directories', async () => {
    const testDir = path.join(os.tmpdir(), 'llm-tokenize-empty-' + Date.now());
    await fs.mkdir(testDir);

    try {
      const { markdown, tokenCount } = await processDirectory(testDir, 'gpt-4');

      expect(markdown).toContain('# Codebase Documentation');
      expect(tokenCount).toBeGreaterThan(0);

    } finally {
      await fs.rm(testDir, { recursive: true, force: true });
    }
  });
});