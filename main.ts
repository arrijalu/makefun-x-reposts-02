// Copies POSTS.json (next to this file) to an output directory.
// Node 22.18+ runs this TypeScript directly. Standard library only.
import { readFileSync, writeFileSync, mkdirSync, renameSync, unlinkSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, 'POSTS.json');

// Output directory: CLI arg first, then env var, then /output.
const targetDir = resolve(process.argv[2] ?? process.env.MAKEFUN_OUTPUT_DIR ?? '/output');
const fallbackDir = join(here, 'out');

function copyPosts(dir: string): void {
  mkdirSync(dir, { recursive: true });
  const data = readFileSync(source); // bytes exactly as stored
  const tmp = join(dir, `.POSTS.json.${process.pid}.tmp`);
  try {
    writeFileSync(tmp, data);
    renameSync(tmp, join(dir, 'POSTS.json')); // atomic replace
  } catch (err) {
    try { unlinkSync(tmp); } catch { /* temp file may not exist */ }
    throw err;
  }
  const posts = validate(data);
  console.log(`POSTS.json -> ${join(dir, 'POSTS.json')} (${data.byteLength} bytes, ${posts.length} posts)`);
}

// Returns the parsed posts array; throws if the file is missing or malformed.
function validate(data: Buffer): unknown[] {
  const parsed: unknown = JSON.parse(data.toString('utf8'));
  if (parsed === null || typeof parsed !== 'object' || !Array.isArray((parsed as { posts?: unknown }).posts)) {
    throw new Error('POSTS.json must be an object with a "posts" array');
  }
  return (parsed as { posts: unknown[] }).posts;
}

// Read and validate before touching the output directory.
let raw: Buffer;
try {
  raw = readFileSync(source);
  validate(raw);
} catch (err) {
  console.error(`POSTS.json missing or invalid: ${(err as Error).message}`);
  process.exit(2);
}

const unwritable = new Set(['EACCES', 'EPERM', 'EROFS', 'ENOENT']);
try {
  copyPosts(targetDir);
} catch (err) {
  const code = (err as NodeJS.ErrnoException).code;
  if (!unwritable.has(code ?? '')) {
    console.error(`Failed to copy POSTS.json: ${(err as Error).message}`);
    process.exit(0); // never fail on an unwritable output
  }
  try {
    copyPosts(fallbackDir);
    console.log(`Wrote to fallback directory: ${fallbackDir}`);
  } catch (fallbackErr) {
    // Last resort: report and exit cleanly.
    console.error(`Could not write ${join(targetDir, 'POSTS.json')} or ${join(fallbackDir, 'POSTS.json')}: ${(fallbackErr as Error).message}`);
    process.exit(0);
  }
}
