# FizzBuzz Terminal

A tiny terminal-style FizzBuzz in the browser, written in TypeScript. Black background, white text. Type a number and press Enter. Enter `0` to quit, then press **Run** to start again.

## Run it

Requires Node.js.

```bash
npm install
npm start
```

It prints the link when it's ready: http://localhost:8000/src/index.html (opening `http://localhost:8000/` redirects there). To use another port, run `PORT=3000 npm start`.

## Scripts

| Command | What it does |
|---|---|
| `npm start` | Build once, then serve on port 8000 |
| `npm run build` | Compile `src/*.ts` to `dist/` |
| `npm run watch` | Recompile whenever a `.ts` file changes |
| `npm run serve` | Serve without building |
| `npm run build:site` | Build `public/`, the folder you publish |
| `npm run typecheck` | Type-check `src/` and `tests/` without building |
| `npm run lint` | Lint and format-check with Biome |
| `npm run lint:fix` | Apply Biome's safe fixes |
| `npm test` | Build, then run the Vitest suite |
| `npm run test:watch` | Re-run tests as you edit |
| `npm run ci` | Everything CI runs: typecheck, lint, test |

For live editing, run `npm run watch` and `npm run serve` in two terminal tabs, then refresh the page after each save.

## CI

`.github/workflows/ci.yaml` runs on every push and pull request: `npm ci`, then `typecheck`, `lint`, and `test`, cheapest check first. Run `npm run ci` before pushing to see what GitHub will see.

## Deploy (Cloudflare)

A host serves one folder as the whole website, but the page lives in `src/` and the compiled script in `dist/`. `npm run build:site` gathers everything into `public/` (page, 404 page and scripts, with the script path adjusted), and that folder is what you publish.

In Cloudflare, create a project from this GitHub repo with:

- **Build command:** `npm run build:site`
- **Output directory:** `public`
- **Environment variable (if the build complains about Node):** `NODE_VERSION` = `24`

Cloudflare serves `index.html` at `/` and shows `404.html` for missing pages.

## Layout

```
src/
  index.html     the page (black background, white text)
  404.html       shown for pages that don't exist
  main.ts        terminal behavior: input, output, Run button
  fizzbuzz.ts    the FizzBuzz logic, no browser code
dist/            compiled JavaScript (generated, git-ignored)
public/          the folder you publish (generated, git-ignored)
tests/           Vitest tests (logic, terminal behavior, dev server, public/ build)
scripts/
  serve.mjs      dev server: folders serve their index.html, missing pages show src/404.html, only src/ and dist/ are served
  build-site.mjs builds public/ from src/ and dist/
.github/workflows/ci.yaml   the CI pipeline
biome.json       linter and formatter settings
package.json     scripts and dependencies
tsconfig.json    TypeScript compiler settings (tests/tsconfig.json for type-checking tests)
```

The page has to be served over http. Opening `index.html` directly as a file won't work, because browsers block module scripts on `file://`.
