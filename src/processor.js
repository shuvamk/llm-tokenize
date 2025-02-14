import { glob } from "glob";
import fs from "fs/promises";
import path from "path";
import mime from "mime-types";
import { encode } from "gpt-tokenizer";

const IGNORED_DIRS = [
  "node_modules",
  ".git",
  "dist",
  "build",
  "coverage",
  ".next",
  ".nuxt",
  ".output",
];

const IGNORED_FILES = [
  ".DS_Store",
  ".env",
  ".env.*",
  "*.log",
  "*.lock",
  "*.map",
  "*.min.*",
  "package-lock.json",
];

const BINARY_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".ico",
  ".webp",
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".zip",
  ".tar",
  ".gz",
  ".7z",
  ".mp3",
  ".mp4",
  ".avi",
  ".mov",
  ".ttf",
  ".woff",
  ".woff2",
  ".eot",
  ".exe",
  ".dll",
  ".so",
  ".dylib",
];

async function getGitignorePatterns(dirPath) {
  try {
    const gitignorePath = path.join(dirPath, ".gitignore");
    const content = await fs.readFile(gitignorePath, "utf-8");
    return content
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((pattern) => pattern.replace(/^\//, "")); // Remove leading slash if present
  } catch (error) {
    return []; // Return empty array if .gitignore doesn't exist
  }
}

export async function processDirectory(dirPath, llmModel) {
  // Get .gitignore patterns
  const gitignorePatterns = await getGitignorePatterns(dirPath);

  const files = await glob("**/*", {
    cwd: dirPath,
    dot: true,
    ignore: [
      ...IGNORED_DIRS.map((dir) => `**/${dir}/**`),
      ...IGNORED_FILES,
      ...gitignorePatterns,
    ],
    nodir: true,
  });

  let markdown = `# Codebase Documentation\n\n`;
  markdown += `Generated for ${llmModel}\n\n`;
  markdown += `## Project Structure\n\n`;

  // Add directory tree
  const tree = generateDirectoryTree(files);
  markdown += `\`\`\`\n${tree}\`\`\`\n\n`;

  markdown += `## Files\n\n`;

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stats = await fs.stat(fullPath);

    // Skip files larger than 10MB
    if (stats.size > 10 * 1024 * 1024) {
      markdown += `### ${file}\n\n`;
      markdown += `*File skipped (size: ${formatFileSize(stats.size)})*\n\n`;
      continue;
    }

    const ext = path.extname(file);

    // Handle binary files
    if (BINARY_EXTENSIONS.includes(ext.toLowerCase())) {
      markdown += `### ${file}\n\n`;
      markdown += `*Binary file (${mime.lookup(ext) || "unknown type"})*\n\n`;
      continue;
    }

    try {
      const content = await fs.readFile(fullPath, "utf-8");

      markdown += `### ${file}\n\n`;
      markdown += `Type: ${getFileType(file)}\n\n`;
      markdown += `Size: ${formatFileSize(stats.size)}\n\n`;

      // Add file content in code block with language
      const language = getLanguageFromExt(ext);
      markdown += "```" + language + "\n";
      markdown += content.trim();
      markdown += "\n```\n\n";
    } catch (error) {
      markdown += `### ${file}\n\n`;
      markdown += `*Error reading file: ${error.message}*\n\n`;
    }
  }

  const tokenCount = encode(markdown).length;

  return { markdown, tokenCount };
}

function generateDirectoryTree(files) {
  let tree = "";
  let prevDir = [];

  files.sort().forEach((file) => {
    const parts = file.split("/");
    const fileName = parts.pop();

    // Compare current directory with previous
    parts.forEach((part, i) => {
      if (prevDir[i] !== part) {
        tree += "  ".repeat(i) + "├── " + part + "/\n";
      }
    });

    tree += "  ".repeat(parts.length) + "├── " + fileName + "\n";
    prevDir = parts;
  });

  return tree;
}

function getFileType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeType = mime.lookup(ext);

  if (mimeType) {
    return mimeType;
  }

  // Handle special cases
  const typeMap = {
    ".jsx": "React JSX",
    ".tsx": "React TypeScript",
    ".vue": "Vue Component",
    ".svelte": "Svelte Component",
    ".astro": "Astro Component",
    ".mdx": "MDX Document",
  };

  return typeMap[ext] || "plain/text";
}

function getLanguageFromExt(ext) {
  const langMap = {
    ".js": "javascript",
    ".jsx": "jsx",
    ".ts": "typescript",
    ".tsx": "tsx",
    ".py": "python",
    ".rb": "ruby",
    ".java": "java",
    ".cpp": "cpp",
    ".c": "c",
    ".cs": "csharp",
    ".go": "go",
    ".rs": "rust",
    ".php": "php",
    ".html": "html",
    ".css": "css",
    ".scss": "scss",
    ".less": "less",
    ".json": "json",
    ".yml": "yaml",
    ".yaml": "yaml",
    ".md": "markdown",
    ".sql": "sql",
    ".sh": "bash",
    ".bash": "bash",
    ".xml": "xml",
    ".vue": "vue",
    ".svelte": "svelte",
    ".astro": "astro",
    ".mdx": "mdx",
  };

  return langMap[ext.toLowerCase()] || "";
}

function formatFileSize(bytes) {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}
