# AGENTS.md

Travel-site monorepo (git remote `ingfou-cpu/django-react`, branch `main`): a Django backend + a React frontend + a vendored third-party tool. Two instruction files matter before anything else: **`agence/AGENTS.md`** (Django-specific, read it before touching `agence/`) and **`DESIGN.md`** (the `frotend/` design system).

## Repo map (easy to get wrong)
- **`agence/`** — Django 6 backend. `manage.py` lives *here*, not at the root: run everything from `agence/`.
- **`frotend/`** — React/Vite frontend. Note the spelling: **`frotend`**, not `frontend`. `npm run dev` serves :5173 and proxies `/api`, `/media`, `/static` → Django :8000 (no CORS), so the React app is opened via **:5173**, never :8000. Verify with `npm run build`.
- **`open-design/`** — vendored, **untracked** copy of the Open Design tool, a separate git repo with its own `.git` and `AGENTS.md`. Changes there are not part of this repo's history and never get committed here. Driven from `open-design/` with `pnpm tools-dev …` (daemon :17456, web :17573). First Next.js compile on Windows takes ~90 s — don't abort early.
- Root `package.json` (puppeteer dep, stub test script) and the untracked `pnpm-lock.yaml`/`pnpm-workspace.yaml` are tooling cruft, not app deps.

## Two separate "variant" systems — don't conflate them
- **Home page variants**: `/` plus `?v=1|2|3|4` selects `Home` / `HomeV1`–`HomeV4`. Routed in `frotend/src/App.jsx` (`HomeRoute`); the floating pills live in `frotend/src/components/HomeVariantSwitcher.jsx`. Adding a variant = 4 edits: new `pages/HomeVn.jsx`, lazy import, route branch, switcher entry.
- **Theme palettes**: an unrelated system (`data-variant` attribute, `useVariant.js`/`ThemeVariantSwitcher`, localStorage `ebt_variant`; Zellige/Dunes/Arabesque/Marrakech). `?v=` never selects a palette.

## Design system & i18n
- `DESIGN.md` is the source of truth for `frotend/` (tokens, `@layer` classes, shared components, motion, RTL, dark mode). Legacy Django/Bootstrap theme: `agence/design.md` + `static/css/styles.css`.
- i18n keys live in `frotend/src/lib/i18n.jsx`: `fr` is the source, `t()` falls back to `fr` when a key is missing in `en`/`ar`. New UI strings must be added to all three locales; DB content is never translated. Django `.po`/`compilemessages` quirks are in `agence/AGENTS.md`.

## Verification (there is no test suite)
- No unit tests anywhere: Django `tests.py` are empty stubs; `frotend` has no test/lint/typecheck config. Verification = `env\Scripts\python.exe manage.py check` (from `agence/`) and `npm run build` (from `frotend/`).
- Smoke-test page changes in a real browser — global convention. The Playwright MCP drives real Chrome; never probe pages with curl/WebFetch (CSS/JS/theme defects only show in the rendered page). Workflow: confirm :8000 (Django) and :5173 (Vite) are listening — they are often already running, and Vite uses `strictPort` — navigate with Playwright, inspect the snapshot/computed styles, then stop what you started.
- Python venv `env/` (sibling of the repo, gitignored) has no activation in fresh shells: call `env\Scripts\python.exe` directly (Python 3.14.5, Django 6). Run Django commands from `agence/`.

## Don't commit
`open-design/`, `.tmp-variants/`, `.tmp-toolsdev-*.log`, `.playwright-mcp/`, `env/`, `db.sqlite3`, `node_modules/`, `dist/`. Note run artifacts `_server*.log`, `_server.err`, `_vite.log`, `_vite.err` are **not** gitignored — remove them before committing.
