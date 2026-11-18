// news-image-20261118 — "Sum up 18 November's world news in one image".
// The entry image is baked into this repository as entry.png; this program
// only copies it to the path the grader reads. No network, no drawing at
// run time: the image is final before the program ever runs.
import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoDir = dirname(fileURLToPath(import.meta.url));
const source = join(repoDir, "entry.png");
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const target = join(outDir, "entry.png");

// The entry must be a whole PNG: check the 8-byte signature before copying,
// so a truncated or non-PNG file fails loudly instead of being submitted.
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const bytes = readFileSync(source);
if (!bytes.subarray(0, 8).equals(PNG_MAGIC)) {
  throw new Error(`${source} is not a PNG file`);
}
if (bytes.length > 1048576) {
  throw new Error(`${source} is ${bytes.length} bytes, over the 1 MiB limit`);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);
const copied = statSync(target).size;
if (copied !== bytes.length) {
  throw new Error(`copy mismatch: wrote ${copied} bytes, expected ${bytes.length}`);
}
console.log(`wrote ${target} (${copied} bytes)`);
