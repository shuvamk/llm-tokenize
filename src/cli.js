#!/usr/bin/env node

import { program } from 'commander';
import { processDirectory } from './processor.js';
import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import fs from 'fs/promises';

program
  .name('llm-tokenize')
  .description('Tokenize a codebase for LLM usage')
  .argument('<folder>', 'Source folder to process')
  .argument('[llm]', 'LLM model to use for tokenization', 'gpt-4')
  .argument('[output]', 'Output file path', './output.md')
  .action(async (folder, llm, output) => {
    const spinner = ora('Processing codebase...').start();
    
    try {
      const absolutePath = path.resolve(folder);
      const stats = await fs.stat(absolutePath);
      
      if (!stats.isDirectory()) {
        throw new Error('Source path must be a directory');
      }

      const { markdown, tokenCount } = await processDirectory(absolutePath, llm);
      
      // Ensure output directory exists
      await fs.mkdir(path.dirname(output), { recursive: true });
      await fs.writeFile(output, markdown, 'utf-8');

      spinner.succeed(chalk.green('Processing complete!'));
      console.log('\nResults:');
      console.log(chalk.blue(`Total tokens: ${tokenCount.toLocaleString()}`));
      console.log(chalk.blue(`Output saved to: ${path.resolve(output)}`));
      
    } catch (error) {
      spinner.fail(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

program.parse();