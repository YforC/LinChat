# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Nuxt application source. `app/pages/` defines routes (e.g., `index.vue`, `[id].vue`), `app/components/` holds UI, `app/composables/` holds shared state/logic, and `app/assets/` contains global CSS.
- `server/api/`: Nitro API routes that proxy external services (for example, `server/api/ai.js` and `server/api/models.get.js`).
- `public/`: static assets served as-is (favicons, `robots.txt`, `public/ai_logos/`).
- `scripts/`: helper scripts (e.g., `scripts/version.sh`).
- `nuxt.config.ts` and `tsconfig.json`: build/runtime configuration.
- `.nuxt/` and `.output/`: generated build artifacts; do not edit.

## Build, Test, and Development Commands
- `npm install`: install dependencies and run `nuxt prepare`.
- `npm run dev`: start the local dev server.
- `npm run build`: create a production build in `.output/`.
- `npm run preview`: serve the production build locally.
- `npm run generate`: generate a static build.
- `npm run version:patch|minor|major`: bump version per SemVer.

## Coding Style & Naming Conventions
- Indent with 2 spaces in Vue SFCs, JS, and TS.
- Prefer single quotes in JS/TS; keep semicolon usage consistent with the file you are editing.
- Vue component files use PascalCase (e.g., `ChatPanel.vue`).
- Composables live in `app/composables/` and follow `useX` naming.
- API routes follow Nitro naming (e.g., `server/api/models.get.js`).

## Testing Guidelines
- No test runner or `npm test` script is configured in this repo.
- If you add tests, place them under `tests/` and use `*.spec.ts` or `*.test.ts`, then add a `test` script.

## Commit & Pull Request Guidelines
- Git history is not available in this checkout, so no commit convention is enforced.
- Use short, imperative subjects (e.g., "Add model selector") and include a scope when helpful.
- PRs should include a concise summary, testing steps, and screenshots for UI changes. Link related issues.

## Configuration & Security
- Runtime settings are in `nuxt.config.ts` with `runtimeConfig`; local overrides belong in `.env`.
- Do not commit real API keys or secrets; use placeholders in docs and examples.

## Additional Notes
- See `CLAUDE.md` for architecture notes and a command reference.
