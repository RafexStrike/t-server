const fs = require("fs");
const path = require("path");

// Usage:
//   node dump-codebase.js
//   node dump-codebase.js /path/to/project
//
// If no path is provided, it uses the current directory.
const ROOT_DIR = path.resolve(process.argv[2] || "./");

const OUTPUT_FILE = path.join(ROOT_DIR, "codebase_dump.md");

// Folders to ignore
const IGNORE_DIRS = [
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
];

// File extensions to include
const ALLOWED_EXT = [
  ".js",
  ".ts",
  ".jsx",
  ".tsx",
  ".json",
  ".md",
  ".css",
  ".html",
];

function shouldIgnore(filePath) {
  const parts = filePath.split(path.sep);

  return parts.some((part) => IGNORE_DIRS.includes(part));
}

function walk(dir, fileList = []) {
  let files;

  try {
    files = fs.readdirSync(dir);
  } catch (err) {
    // A file/directory may disappear while we're scanning
    if (err.code === "ENOENT") {
      return fileList;
    }

    throw err;
  }

  files.forEach((file) => {
    const fullPath = path.join(dir, file);

    // Skip ignored directories/files
    if (shouldIgnore(fullPath)) {
      return;
    }

    let stat;

    try {
      stat = fs.statSync(fullPath);
    } catch (err) {
      // File disappeared between readdir() and stat()
      // This commonly happens with browser lock files,
      // temporary files, etc.
      if (err.code === "ENOENT") {
        return;
      }

      throw err;
    }

    if (stat.isDirectory()) {
      walk(fullPath, fileList);
    } else {
      const ext = path.extname(fullPath);

      if (ALLOWED_EXT.includes(ext)) {
        fileList.push(fullPath);
      }
    }
  });

  return fileList;
}

function generateDump() {
  console.log(`📂 Scanning: ${ROOT_DIR}`);

  const files = walk(ROOT_DIR);

  let output = "# Codebase Dump\n\n";

  files.forEach((file) => {
    let content;

    try {
      content = fs.readFileSync(file, "utf-8");
    } catch (err) {
      // File may have disappeared after the scan
      if (err.code === "ENOENT") {
        return;
      }

      throw err;
    }

    const relativePath = path.relative(ROOT_DIR, file);
    const ext = path.extname(file).slice(1);

    output += "\n\n---\n";
    output += `## FILE: ${relativePath}\n\n`;
    output += `\`\`\`${ext}\n`;
    output += content;
    output += "\n```\n";
  });

  fs.writeFileSync(OUTPUT_FILE, output);

  console.log(`✅ Dump created: ${OUTPUT_FILE}`);
  console.log(`📁 Files dumped: ${files.length}`);
}

generateDump();