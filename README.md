# llm-tokenize

```
 _      _      __  __     _______ ____  _  ________ _   _ _____ ____________
| |    | |    |  \/  |   |__   __/ __ \| |/ /  ____| \ | |_   _|___  /  ____|
| |    | |    | \  / |______| | | |  | | ' /| |__  |  \| | | |    / /| |__
| |    | |    | |\/| |______| | | |  | |  < |  __| | . ` | | |   / / |  __|
| |____| |____| |  | |      | | | |__| | . \| |____| |\  |_| |_ / /__| |____
|______|______|_|  |_|      |_|  \____/|_|\_\______|_| \_|_____/_____|______|
```

> 🚀 Supercharge your codebase for LLM processing!
>
> ⭐ If you find this tool useful, please consider [giving it a star on GitHub](https://github.com/shuvamk/llm-tokenize)!

A powerful CLI tool to convert and tokenize codebases for LLM usage. Perfect for preparing your project for AI analysis!

## 🚀 Quick Start

Just `cd` into your project directory and run:

```bash
npx llm-tokenize .
```

That's it! Your codebase will be tokenized and ready for LLM processing. 🎉

## 📦 Installation

If you prefer a global installation:

```bash
npm install -g llm-tokenize
```

Or use directly with npx (no installation needed):

```bash
npx llm-tokenize <folder> [llm] [output_path]
```

## 🛠️ Usage

```bash
llm-tokenize <folder> [llm] [output_path]
```

Arguments:

- `folder`: Source folder to process (required) - Use `.` for current directory
- `llm`: LLM model to use for tokenization (default: "gpt-4")
- `output_path`: Output file path (default: "./output.md")

Examples:

```bash
# Process current directory
llm-tokenize .

# Process specific project with custom output
llm-tokenize ./my-project gpt-4 ./docs/codebase.md

# Process with different LLM model
llm-tokenize . gpt-3.5-turbo
```

## ✨ Features

- 🔄 Recursively processes entire directory structures
- 📝 Generates well-formatted markdown documentation
- 🌳 Includes directory tree visualization
- 🖼️ Handles binary files appropriately
- 🎨 Provides proper syntax highlighting for code blocks
- 📊 Shows file types and sizes
- 🔢 Calculates total token count for LLM context
- 🚫 Ignores common unnecessary directories and files
- 📦 Handles large files and binary content appropriately
- 🎯 Respects .gitignore patterns

## 🚫 Ignored Items

The following are automatically ignored:

- 📁 node_modules
- 🔒 .git
- 🏗️ dist/build directories
- 📊 Coverage reports
- 💾 Binary files
- 🔑 Environment files
- 📝 Log files
- 🔒 Lock files
- ✨ All patterns from .gitignore file

## 📄 Output Format

The generated markdown includes:

1. 📋 Project overview
2. 🌳 Directory structure
3. 📑 File listing with:
   - 📝 File type
   - 📊 File size
   - 🎨 Syntax-highlighted content
   - 💾 Binary file notifications
   - ⚠️ Large file warnings

## 👨‍💻 Author

Created with ❤️ by [Shuvam Kumar](https://github.com/shuvamk)

## ⭐ Support

If you find this tool useful, please consider:

1. [Giving it a star on GitHub](https://github.com/shuvamk/llm-tokenize)
2. [Reporting issues](https://github.com/shuvamk/llm-tokenize/issues)
3. Contributing to the project

Your support helps make this tool better for everyone! 🙌

## 📜 License

MIT
