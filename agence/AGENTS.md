# AGENTS.md

## Layout (easy to get wrong)
- The git repo now lives at the **workspace root** `E:\Django\Agence_de_voyage` and contains both `agence/` (Django backend) and `frotend/` (React/Vite frontend). `manage.py` is at `agence/manage.py` — run commands from `agence/`, not the workspace root.
- Git remote `origin` → `https://github.com/ingfou-cpu/django-react.git` (branch `main`). The old backend-only repo `ingfou-cpu/agence_api.git` still exists on GitHub but is no longer the remote; `agence/.git` was removed when the combined repo was created.
- The venv `env/` is a sibling of the repo (at `E:\Django\Agence_de_voyage\env`, ignored by the root `.gitignore`). It has no full activation context in fresh shells; call it directly:
  `& "E:\Django\Agence_de_voyage\env\Scripts\python.exe" manage.py ...` (Python 3.14.5, Django 6).
- Two apps: `Agapp` (main travel site — **blog included**, just `blog_list`/`blog_detail` in `Agapp/views.py`, no separate blog app) and `weatherapp` (OpenWeather lookup). Project config lives in `agence/`.

## Commands
- Sanity check (no test suite exists — `tests.py` are empty stubs): `& ...\env\Scripts\python.exe manage.py check`
- **Smoke-test pages in Chrome via Playwright — global convention.** The Playwright MCP server is configured with `--browser chrome` in the user-level `opencode.jsonc` (so it always drives the real Chrome). Use Playwright for **every** page check, local or remote — never WebFetch, `Invoke-WebRequest`/curl, or the Django test client for page probes: CSS/JS problems (invisible text, theme overrides) only surface in the rendered page. Workflow: start `runserver` in the background (`Start-Process` with `--noreload`, no HTTP-status probe), navigate `http://127.0.0.1:8000/…` with Playwright, verify via snapshot / computed styles, then stop the listener. The Django test client is still usable for pure-HTTP checks (`ALLOWED_HOSTS` rejects `testserver`; pass `Client(HTTP_HOST='127.0.0.1')`).
- Migrations: `manage.py makemigrations` / `manage.py migrate`. DB is `db.sqlite3`, **gitignored** — schema changes travel via migration files only.
- Run server: `manage.py runserver`.

## i18n (fr is the source; 3 locales)
- `LANGUAGE_CODE='fr'`, `LANGUAGES` = fr/en/ar, `LOCALE_PATHS = [BASE_DIR/'locale']`. Templates use `{% trans %}`; forms use `gettext_lazy as _`.
- Edits to `locale/{ar,en,fr}/LC_MESSAGES/django.po` require `manage.py compilemessages`; the `.mo` files are tracked.
- **Duplicate msgids break `compilemessages`**: shared strings (Envoyer, Nom, Email, Commentaire, Laisser un commentaire, …) already exist in the `.po` files — grep them before adding a msgid, then only add the `#:` reference line. French msgstrs are conventionally left empty (msgid is already the French text).
- **Obsolete (`#~`) entries also break `compilemessages`** ("Double définition de message") if you add the same msgid active. `locale/ar/LC_MESSAGES/django.po` previously carried a large `#~` block from the deployed site — removed during the theme import. Grep including `#~` lines before adding a msgid, or clean the obsolete block.
- Adding empty-msgstr entries to the fr `.po` does not change fr `.mo` (gettext omits untranslated entries) — git may show `fr/.po` modified without `fr/.mo`.
- Language switch: `/lang/<fr|en|ar>/` (name `set_language`) sets a persistent cookie — browser test sessions keep their last language (pages may render in Arabic until you hit `/lang/fr/`). DB content (blog titles, etc.) is NOT translated, only templates.

## Env & secrets
- `agence/.env` (gitignored) supplies `STRIPE_PUBLIC_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `VOTRE_CLE_API_FIXER`. All have `''` fallbacks, so the app runs without them.
- `weatherapp/views.py` hardcodes an OpenWeather API key (~line 9). Don't add/commit new keys without the owner.

## CSS: the theme & its tokens
- `static/css/styles.css` is the **deployed** "EL BAYADH TRAVELS — Maghreb Saharien" theme (Bootstrap 5.2.3 bundled, 13 334 lines). The theme section starts at line ~11623 and defines **`--ka-*` AND `--eb-*` globally at `:root`** (copper `#c97b3a` / green `#234d42` / sand palette). `static/js/scripts.js` is the matching deployed script. Source of truth: https://ingfou32.pythonanywhere.com/ (`/static/css/styles.css?v=2`) — re-import it rather than hand-editing theme tokens.
- Tokens are now global, so the templates that previously rendered broken colors (404, booking_recap, croisiere, map, search, registration/*) resolve to the copper palette. **Except the blog templates**: `blog/list.html` and `blog/detail.html` redefine `--eb-*` in their own inline `<style>` (indigo-on-navy `#6d5dfb`) on purpose.
- Dark/light mode: `<body data-theme="dark">` (default) + `#darkModeToggle` button in `base.html`; `[data-theme="light"]` overrides the `--ka-*` surface tokens; choice persists in `localStorage.theme`.
- A few theme rules assume their element sits on a **dark section**, so on cream/white pages they need local overrides: `.nav-pills .nav-link` (cream text) and `.bg-black .project-text h3` (dark-on-black). `circuit_touris.html` carries a page-scoped `<style>` for both — copy that pattern rather than editing `styles.css`.
- Do not use the old Grayscale tokens (`--brand`, `.btn-brand`, `.masthead-spacer`, `.gradient-text`) — they were removed.

## Django messages
- `messages` middleware + context processor are on, but **`base.html` does NOT render them**. Only `circuitChoisi.html`, `blog/detail.html`, `contact.html`, `payment_home.html`, `temoignage.html`, `testimonial_form.html` do. Adding `messages.success(...)` to another page silently shows nothing — add a render block first (see the toast in `blog/detail.html`).
- Most existing `messages.success(...)` calls in views.py are hardcoded French (not wrapped in `_()`), so they don't translate. Wrap new ones.

## Data & deploy quirks
- `Destination` and `pack_travel` carry `latitude`/`longitude` (default `33.7, 3.0`). New items must set real coords in admin or their markers stack at the default on `/map/`.
- `/map/` renders a marker for **every** `Destination` and `pack_travel` automatically (no registration step).
- `media/` and `static/` are tracked in git; only `*.pyc`, `__pycache__/`, `.env`, `db.sqlite3` are ignored — run artifacts like `_server.log`/`_server.err` are NOT ignored.
- `ALLOWED_HOSTS` includes `ingfou32.pythonanywhere.com` → deployed on PythonAnywhere.
