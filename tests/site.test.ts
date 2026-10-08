// Checks that `npm run build:site` makes a folder (public/) that works on its own.
// That folder is what gets published, so it must contain everything the page
// needs and must not reach back into src/ or dist/.
//
// `npm test` builds first, so dist/ exists when this runs.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeAll, describe, expect, it } from "vitest";

const root = fileURLToPath(new URL("..", import.meta.url));
const inPublic = (name: string): string => join(root, "public", name);

beforeAll(() => {
  execFileSync("node", [join(root, "scripts/build-site.mjs")], { cwd: root });
});

describe("public/ folder", () => {
  it("contains the page, the 404 page and the scripts", () => {
    for (const name of ["index.html", "404.html", "main.js", "fizzbuzz.js"]) {
      expect(existsSync(inPublic(name)), `${name} is missing`).toBe(true);
    }
  });

  it("loads its script from beside the page, not from dist/", () => {
    const page = readFileSync(inPublic("index.html"), "utf8");

    expect(page).toContain('src="./main.js"');
    expect(page).not.toContain("dist/");
  });
});
