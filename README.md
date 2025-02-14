# llm-tokenize

A CLI tool to convert and tokenize codebases for LLM usage.

## Installation

```bash
npm install -g llm-tokenize
```

Or use directly with npx:

```bash
npx llm-tokenize <folder> [llm] [output_path]
```

## Usage

```bash
llm-tokenize <folder> [llm] [output_path]
```

Arguments:
- `folder`: Source folder to process (required)
- `llm`: LLM model to use for tokenization (default: "gpt-4")
- `output_path`: Output file path (default: "./output.md")

Example:
```bash
npx llm-tokenize ./my-project gpt-4 ./docs/codebase.md
```

## Features

- Recursively processes entire directory structures
- Generates well-formatted markdown documentation
- Includes directory tree visualization
- Handles binary files appropriately
- Provides proper syntax highlighting for code blocks
- Shows file types and sizes
- Calculates total token count for LLM context
- Ignores common unnecessary directories and files
- Handles large files and binary content appropriately
- Respects .gitignore patterns

## Ignored Items

The following are automatically ignored:
- node_modules
- .git
- dist/build directories
- Coverage reports
- Binary files
- Environment files
- Log files
- Lock files
- All patterns from .gitignore file

## Output Format

The generated markdown includes:
1. Project overview
2. Directory structure
3. File listing with:
   - File type
   - File size
   - Syntax-highlighted content
   - Binary file notifications
   - Large file warnings

## Author

Created by [Shuvam Kumar](https://github.com/shuvamk)

## License

MIT