#!/usr/bin/env node
// Compiles the 14 canonical command sources in ai-commands/src/*.md into the
// platform-specific formats consumed by GitHub Copilot, Cursor, and Gemini CLI.
// Generated files — do not edit outputs by hand; edit ai-commands/src and re-run.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC_DIR = path.join(ROOT, 'ai-commands', 'src');
const COPILOT_DIR = path.join(ROOT, '.github', 'prompts');
const CURSOR_DIR = path.join(ROOT, '.cursor', 'commands');
const GEMINI_DIR = path.join(ROOT, '.gemini', 'commands');

function readSourceCommands() {
  const files = fs
    .readdirSync(SRC_DIR)
    .filter((f) => f.endsWith('.md'))
    .sort();

  return files.map((file) => {
    const name = file.slice(0, -3);
    // Normalize CRLF so autocrlf checkouts don't produce spurious drift
    const raw = fs.readFileSync(path.join(SRC_DIR, file), 'utf8').replace(/\r\n/g, '\n');
    const lines = raw.split('\n');

    if (lines[0].trim() !== '---') {
      throw new Error(`${file}: missing opening frontmatter delimiter`);
    }

    let closeIdx = -1;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '---') {
        closeIdx = i;
        break;
      }
    }
    if (closeIdx === -1) {
      throw new Error(`${file}: missing closing frontmatter delimiter`);
    }

    let description = null;
    let argumentHint = null;

    for (let i = 1; i < closeIdx; i++) {
      const line = lines[i];
      if (line.startsWith('description:')) {
        description = line.slice('description:'.length).trim();
      } else if (line.startsWith('argument_hint:')) {
        argumentHint = line.slice('argument_hint:'.length).trim();
      }
    }

    if (!description) {
      throw new Error(`${file}: missing required 'description' key`);
    }

    const body = lines.slice(closeIdx + 1).join('\n').trim();

    return { name, description, argumentHint, body };
  });
}

function withSingleTrailingNewline(content) {
  return content.replace(/\s*$/, '') + '\n';
}

function buildCopilot(cmd) {
  const parts = ['---', `name: ${cmd.name}`, `description: ${cmd.description}`];
  if (cmd.argumentHint) {
    parts.push(`argument-hint: ${cmd.argumentHint}`);
  }
  parts.push('agent: agent', '---', '', cmd.body);
  return withSingleTrailingNewline(parts.join('\n'));
}

function buildCursor(cmd) {
  const content = `# /${cmd.name} — ${cmd.description}\n\n${cmd.body}`;
  return withSingleTrailingNewline(content);
}

function escapeGeminiDescription(description) {
  return description.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function buildGemini(cmd) {
  const description = escapeGeminiDescription(cmd.description);
  const content = `description = "${description}"\n\nprompt = """\n${cmd.body}\n\nUser request: {{args}}\n"""`;
  return withSingleTrailingNewline(content);
}

function buildAllOutputs(commands) {
  const outputs = new Map();
  for (const cmd of commands) {
    outputs.set(path.join(COPILOT_DIR, `${cmd.name}.prompt.md`), buildCopilot(cmd));
    outputs.set(path.join(CURSOR_DIR, `${cmd.name}.md`), buildCursor(cmd));
    outputs.set(path.join(GEMINI_DIR, `${cmd.name}.toml`), buildGemini(cmd));
  }
  return outputs;
}

function ensureDirs() {
  for (const dir of [COPILOT_DIR, CURSOR_DIR, GEMINI_DIR]) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function check(outputs) {
  const diverging = [];
  for (const [filePath, expected] of outputs) {
    if (!fs.existsSync(filePath)) {
      diverging.push(filePath);
      continue;
    }
    const actual = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
    if (actual !== expected) {
      diverging.push(filePath);
    }
  }

  if (diverging.length > 0) {
    console.log('ai-commands: out of sync, divergent files:');
    for (const filePath of diverging) {
      console.log(`  ${path.relative(ROOT, filePath)}`);
    }
    process.exit(1);
  }

  console.log(`ai-commands: ${outputs.size} outputs in sync`);
  process.exit(0);
}

function write(outputs) {
  ensureDirs();
  const counts = { copilot: 0, cursor: 0, gemini: 0 };
  for (const [filePath, content] of outputs) {
    fs.writeFileSync(filePath, content, 'utf8');
    if (filePath.startsWith(COPILOT_DIR)) counts.copilot++;
    else if (filePath.startsWith(CURSOR_DIR)) counts.cursor++;
    else if (filePath.startsWith(GEMINI_DIR)) counts.gemini++;
  }
  console.log(`ai-commands: wrote ${outputs.size} outputs`);
  console.log(`  .github/prompts: ${counts.copilot}`);
  console.log(`  .cursor/commands: ${counts.cursor}`);
  console.log(`  .gemini/commands: ${counts.gemini}`);
}

function main() {
  let commands;
  try {
    commands = readSourceCommands();
  } catch (err) {
    console.error(`build-ai-commands: ${err.message}`);
    process.exit(1);
  }
  const outputs = buildAllOutputs(commands);

  if (process.argv.includes('--check')) {
    check(outputs);
  } else {
    write(outputs);
  }
}

main();
