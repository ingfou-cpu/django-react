# CLAUDE.md — El Bayadh Travels (Agence de Voyage)

> **Purpose**: Quick-reference for AI assistants working on this Django + React monorepo.  
> **Keep updated**: Add new conventions, commands, and architectural decisions as they emerge.

---

## 🗺️ Repository Map

```
E:\Django\Agence_de_voyage\                 ← workspace root (git repo)
├── agence/                                  ← Django 6 backend (manage.py lives HERE)
│   ├── agence/                              ← project config (settings, urls, wsgi, asgi)
│   ├── Agapp/                               ← main travel app (models, views, templates)
│   ├── weatherapp/                          ← OpenWeather integration
│   ├── static/                              ← legacy Bootstrap theme (styles.css, scripts.js)
│   ├── media/                               ← uploaded images (git-tracked)
│   ├── locale/                              ← i18n .po/.mo files (fr/en/ar)
│   ├── .env                                 ← secrets (gitignored)
│   ├── db.sqlite3                           ← dev database (gitignored)
│   └── manage.py
├── frotend/                                 ← React 18 / Vite frontend (note spelling!)
│   ├── src/
│   │   ├── components/                      ← shared UI components (Reveal, Navbar, cards…)
│   │   ├── hooks/                           ← useAuth, useTheme, useVariant, useMagnetic…
│   │   ├── lib/                             ← api.js, i18n.jsx, format.jsx, themes.jsx
│   │   ├── pages/                           ← route-level components (HomeV1–V5, detail, auth…)
│   │   ├── App.jsx                          ← routes + Home variant switcher
│   │   ├── main.jsx                         ← entry point
│   │   └── index.css                        ← design tokens + @layer components + utilities
│   ├── package.json                         ← deps: react, react-router, leaflet, recharts, tailwind
│   ├── vite.config.js                       ← proxy /api, /media, /static → Django :8000
│   └── tailwind.config.js
├── open-design/                             ← vendored Open Design tool (untracked, own .git)
├── .agents/, .aidesigner/, .claude/         ← tooling config
├── DESIGN.md                                ← source of truth for frotend/ design system
├── agence/design.md                         ← legacy Django/Bootstrap theme notes
├── AGENTS.md                                ← repo-level instructions (this file's sibling)
└── agence/AGENTS.md                         ← Django-specific instructions
```

---

## 🔑 Key Concepts (Easy to Get Wrong)

| Area | Detail |
|------|--------|
| **Manage.py location** | `agence/manage.py` — run all Django commands from `agence/` |
| **Frontend port** | Vite serves `:5173` and proxies `/api`, `/media`, `/static` → Django `:8000`. Open the app at **`http://localhost:5173`**, never `:8000` directly. |
| **Python venv** | `env/` (sibling of repo, gitignored). No activation in fresh shells → call directly: `& "E:\Django\Agence_de_voyage\env\Scripts\python.exe" manage.py …` (Python 3.14.5, Django 6). |
| **Two "variant" systems** | 1) **Home page variants** — `?v=1|2|3|4` selects `Home`/`HomeV1`–`HomeV4` in `App.jsx`. 2) **Theme palettes** — `data-variant` attribute (Zellige/Dunes/Arabesque/Marrakech), persisted in `localStorage.ebt_variant`. They are **unrelated**. |
| **i18n** | `fr` = source language. Keys in `frotend/src/lib/i18n.jsx` (flat `namespace.section.key`). `t()` falls back to `fr`. DB content never translated. Django `.po` files in `agence/locale/`. |
| **No test suite** | Django `tests.py` are empty stubs; frotend has no test/lint/typecheck. Verification = `manage.py check` + `npm run build` + **Playwright smoke-test in real Chrome**. |

---

## 🛠️ Common Commands

### Django (run from `agence/`)

```bash
# Sanity check (no tests)
& "E:\Django\Agence_de_voyage\env\Scripts\python.exe" manage.py check

# Run dev server (background)
Start-Process -FilePath "E:\Django\Agence_de_voyage\env\Scripts\python.exe" -ArgumentList "manage.py runserver --noreload" -WorkingDirectory "E:\Django\Agence_de_voyage\agence"

# Migrations
& "E:\Django\Agence_de_voyage\env\Scripts\python.exe" manage.py makemigrations
& "E:\Django\Agence_de_voyage\env\Scripts\python.exe" manage.py migrate

# i18n compile (after editing .po files)
& "E:\Django\Agence_de_voyage\env\Scripts\python.exe" manage.py compilemessages
```

### Frontend (run from `frotend/`)

```bash
npm run dev          # starts Vite on :5173 (strictPort)
npm run build        # production build → dist/
npm run preview      # preview production build
```

### Verification Workflow (Global Convention)

1. Ensure Django `:8000` and Vite `:5173` are listening (often already running).
2. Use **Playwright MCP** (configured with `--browser chrome`) to navigate pages.
3. Inspect snapshot / computed styles — CSS/JS/theme defects only surface in rendered page.
4. Stop what you started.

> Never use `curl`, `WebFetch`, or Django test client for page probes.

---

## 🏗️ Architecture Overview

### Django Backend (`agence/`)

**Apps**: `Agapp` (main), `weatherapp`  
**Key Models** (`Agapp/models.py`):
- `Destination` — city, price, lat/lon, image
- `Hotel` — FK to Destination, stars, price
- `Booking` — hotel/destination reservation
- `pack_travel` — circuits/croisières (itinerary, dates, gallery)
- `reser_circuit` — circuit bookings
- `PaymentRecord` — Stripe checkout sessions, webhook handling
- `BlogPost` / `BlogComment` — blog (included in Agapp, no separate app)
- `Testimonial`, `Contact`, `NewsletterSubscriber`

**API**: DRF + `drf-spectacular` (OpenAPI at `/api/schema/`)  
**Auth**: Django built-in (`login`, `logout`, `register`, `profile`)  
**Payments**: Stripe Checkout (session-based, webhook at `/stripe/webhook/`)  
**Weather**: `weatherapp` calls OpenWeather (API key hardcoded in `views.py`)

### React Frontend (`frotend/`)

**Stack**: React 18, React Router 6, Tailwind CSS, Vite  
**Design System**: Defined in `DESIGN.md` — tokens, components, motion, RTL, dark mode, 4 theme variants  
**i18n**: `frotend/src/lib/i18n.jsx` — `fr`/`en`/`ar` with `t()` helper  
**Pages**: 25+ route components in `src/pages/` (Home variants V1–V5, detail pages, auth, payments, blog, etc.)  
**Shared Components**: `src/components/` — `Navbar`, `Footer`, `Reveal`, `DestinationCard`, `PackCard`, `WeatherWidget`, `ThemeVariantSwitcher`, etc.

---

## 🎨 Design System (Frontend)

**Source of truth**: `DESIGN.md`

### Tokens (`index.css` @layer base)
- Color variables: `--c-copper`, `--c-forest`, `--c-forest-darker`, `--c-sand`, `--c-cream`, `--c-accent`
- 4 theme variants: **Zellige** (emerald/gold), **Dunes** (terracotta/sand), **Arabesque** (teal/brass), **Marrakech** (charcoal/gold)
- Tailwind colors: `copper`, `forest`, `sand`, `gold`, `cream`, `terracotta`
- Dark mode: `html.dark` class (persisted in `localStorage.ebt_theme`)

### Typography
- `font-sans`: Inter (body/UI)
- `font-display`: Playfair Display (headings)
- `font-arabic`: Amiri (Arabic headings)
- Scale: `.display-text` (hero), `.display-2` (page hero), `text-4xl md:text-5xl` (sections)
- Kickers: `.text-xs.font-bold.uppercase.tracking-widest.text-terracotta`

### Components (CSS @layer components)
`.container-site`, `.btn*`, `.card`, `.glass-panel`, `.input`, `.label`, `.badge`, `.section-title`

### React Components (`src/components/`)
`Reveal`, `SectionTitle`, `PageHero`, `CtaBanner`, `AuthLayout`, `Navbar`, `Footer`, `DestinationCard`, `PackCard`, `WeatherWidget`, `ThemeVariantSwitcher`, `Spinner`, `ErrorState`, `ScrollToTop`

### Motion
Scroll-reveal (`Reveal`), image reveal, magnetic buttons (`useMagnetic`), parallax (`useParallax`), hide-on-scroll navbar, hover lift, image zoom, `scaleIn` keyframes

### Page Recipes
PageHero → Editorial break → Bento grid → Dark immersive → CTA band → Card grid

---

## 🌐 i18n Conventions

### Frontend (`frotend/`)
- Languages: `fr` (default), `en`, `ar`
- Keys: flat strings `namespace.section.key` in `src/lib/i18n.jsx`
- `t('key')` → `messages[lang]` → fallback to `fr`
- **All UI chrome translated**; DB content stays as-is
- RTL: `html[lang='ar']` + `dir="rtl"`, logical props (`ps-*`/`pe-*`), `rtl:rotate-180` on arrows

### Django (`agence/`)
- `LANGUAGE_CODE='fr'`, `LANGUAGES = fr/en/ar`, `LOCALE_PATHS = [BASE_DIR/'locale']`
- Templates: `{% trans %}`, forms: `gettext_lazy as _`
- **Duplicate msgids break `compilemessages`** — grep before adding
- **Obsolete (`#~`) entries also break `compilemessages`** — clean or grep including `#~`
- French `msgstr` conventionally left empty (msgid is French)
- Language switch: `/lang/<fr|en|ar>/` (sets persistent cookie)
- Django messages middleware ON but **`base.html` does NOT render them** — only specific templates do

---

## 💳 Payments (Stripe)

- `STRIPE_PUBLIC_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` in `agence/.env`
- Checkout sessions created in `create_checkout_destination` / `create_checkout_pack`
- Webhook (`stripe_webhook`) handles `checkout.session.completed`, `expired`, `payment_intent.succeeded/failed`
- `PaymentRecord` links to `Booking` or `reser_circuit` via metadata
- Success/cancel pages: `payment_success`, `payment_cancel`
- Frontend receives `stripe_public_key` via context / API

---

## 🗄️ Database & Migrations

- SQLite `db.sqlite3` (gitignored) — schema changes via migration files only
- `Destination` & `pack_travel` have `latitude`/`longitude` (default `33.7, 3.0`) — set real coords in admin for map markers
- `/map/` renders marker for **every** Destination and pack_travel automatically

---

## 📦 Static / Media Files

- `STATIC_URL = 'static/'`, `STATICFILES_DIRS = ['static/']`
- `MEDIA_URL = '/media/'`, `MEDIA_ROOT = BASE_DIR/'media'`
- Both `media/` and `static/` are **tracked in git** (only `*.pyc`, `__pycache__/`, `.env`, `db.sqlite3` ignored)
- Run artifacts (`_server*.log`, `_vite*.log`) are **NOT gitignored** — remove before committing
- Vite proxies `/media/` and `/static/` to Django in dev

---

## 🚀 Deployment

- `ALLOWED_HOSTS` includes `ingfou32.pythonanywhere.com` → deployed on PythonAnywhere
- Legacy theme CSS: `agence/static/css/styles.css` (Bootstrap 5.2.3 bundled, 13k lines)
  - Theme tokens: `--ka-*` AND `--eb-*` at `:root` (copper `#c97b3a` / green `#234d42`)
  - Dark mode: `<body data-theme="dark">` + `#darkModeToggle` in `base.html`
  - Blog templates (`blog/list.html`, `blog/detail.html`) override with indigo palette on purpose
  - Source of truth: `https://ingfou32.pythonanywhere.com/static/css/styles.css?v=2`

---

## 📋 File-Specific Notes

### `agence/agence/settings.py`
- `DEBUG = True`, `SECRET_KEY` hardcoded (dev only)
- `CORS_ALLOWED_ORIGINS` = `localhost:5173`, `127.0.0.1:5173`
- `CSRF_TRUSTED_ORIGINS` same
- `REST_FRAMEWORK` → `drf_spectacular.openapi.AutoSchema`
- `SPECTACULAR_SETTINGS` with sidecar Swagger/Redoc
- `HANDLER404 = 'Agapp.views.handler404'`

### `frotend/vite.config.js`
- Proxy: `/api`, `/media`, `/static` → `http://127.0.0.1:8000`
- `strictPort: true`

### `frotend/tailwind.config.js`
- Custom colors: `copper`, `forest`, `sand`, `gold`, `cream`, `terracotta`
- Fonts: `sans`, `display`, `arabic`, `mono`
- Shadows: `soft`, `soft-lg`, `card`, `glow`

---

## ✅ Before Committing

1. Remove run artifacts: `_server*.log`, `_server.err`, `_vite*.log`, `_vite.err`
2. Run `manage.py check` (from `agence/`)
3. Run `npm run build` (from `frotend/`)
4. Smoke-test key pages with Playwright
5. Ensure no new secrets in `.env` or hardcoded keys

---

## 🔗 Related Files

- `AGENTS.md` — repo-level instructions
- `agence/AGENTS.md` — Django-specific instructions
- `DESIGN.md` — frontend design system (source of truth)
- `agence/design.md` — legacy Django theme notes