// Builds public/, the folder you publish (for example to Cloudflare).
// Your page lives in src/ and the compiled script in dist/, but a host serves
// one folder as the whole website, so this gathers everything into one place:
//
//   public/index.html   the page, pointing at ./main.js
//   public/404.html     shown for any page that doesn't exist
//   public/main.js      compiled from src/main.ts
//   public/fizzbuzz.js  compiled from src/fizzbuzz.ts
//
// Run `npm run build` first (or use `npm run build:site`, which does both).
import {
  copyFile,
  mkdir,
  readdir,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SRC = join(ROOT, "src");
const DIST = join(ROOT, "dist");
const PUBLIC = join(ROOT, "public");

// In src/, the page loads its script from the dist/ folder next to it.
// In public/, the script sits right beside the page.
const DEV_SCRIPT_PATH = "../dist/main.js";
const PUBLIC_SCRIPT_PATH = "./main.js";

await rm(PUBLIC, { recursive: true, force: true });
await mkdir(PUBLIC);

const page = await readFile(join(SRC, "index.html"), "utf8");
if (!page.includes(DEV_SCRIPT_PATH)) {
  throw new Error(
    `src/index.html no longer contains "${DEV_SCRIPT_PATH}", so the script path can't be rewritten`,
  );
}
await writeFile(
  join(PUBLIC, "index.html"),
  page.replace(DEV_SCRIPT_PATH, PUBLIC_SCRIPT_PATH),
);

await copyFile(join(SRC, "404.html"), join(PUBLIC, "404.html"));

const scripts = (await readdir(DIST)).filter((name) => name.endsWith(".js"));
if (!scripts.includes("main.js")) {
  throw new Error("dist/main.js is missing. Run `npm run build` first.");
}
for (const name of scripts) {
  await copyFile(join(DIST, name), join(PUBLIC, name));
}

console.log(
  `Built public/ (${["index.html", "404.html", ...scripts].join(", ")})`,
);
