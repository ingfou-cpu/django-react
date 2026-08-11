import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api.js';
import { mediaUrl, formatDate, formatPrice } from '../lib/format.jsx';
import { useLanguage } from '../lib/i18n.jsx';
import Reveal from '../components/Reveal.jsx';
import DestinationCard from '../components/DestinationCard.jsx';
import WeatherWidget from '../components/WeatherWidget.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import Spinner from '../components/Spinner.jsx';

/* ------------------------------------------------------------------ */
/*  V1 — Éditorial galerie                                             */
/*  Airy magazine look on sand/cream. Staggered gallery hero, editorial */
/*  numbering, thin rules, generous whitespace.                         */
/* ------------------------------------------------------------------ */

/* ---------------------------- Hero collage ------------------------- */

function Hero({ t, destinations }) {
  const [main, ...stack] = destinations;
  const second = stack[0];

  return (
    <section className="relative overflow-hidden bg-cream dark:bg-forest-darker pt-24 lg:pt-28 pb-16 lg:pb-24">
      {/* faint zellige texture in the corner */}
      <div className="pointer-events-none absolute -top-24 -end-24 w-[34rem] h-[34rem] opacity-[0.06] pattern-zellige" />

      <div className="container-site relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Text column */}
        <div className="lg:col-span-5 z-10">
          <Reveal>
            <div className="flex items-center gap-4 mb-7">
              <span className="h-px w-10 bg-terracotta" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-terracotta">
                {t('home.hero2.kicker')}
              </span>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <h1 className="font-display display-text text-forest-dark dark:text-sand-light leading-[0.95]">
              Silence <span className="italic font-light text-forest-dark/30 dark:text-sand-dark/60">&amp;</span> Sand.
            </h1>
          </Reveal>

          <Reveal delay={2}>
            <p className="mt-7 max-w-md text-lg md:text-xl leading-relaxed text-forest-dark/70 dark:text-sand-dark">
              {t('home.hero2.tagline')}
            </p>
          </Reveal>

          <Reveal delay={3}>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                to="/circuit/"
                className="btn-primary px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider"
              >
                {t('home.hero2.cta')}
              </Link>
              <Link
                to="/destinations/"
                className="btn-ghost !text-forest-dark dark:!text-sand-light items-center gap-2"
              >
                <i className="bi bi-geo-alt"></i> {t('nav.destinations')}
              </Link>
            </div>
          </Reveal>

          <Reveal delay={3}>
            <div className="mt-14 flex gap-14 border-t border-forest-dark/10 dark:border-white/10 pt-8">
              {[
                { value: '15+', label: t('home.hero2.yearsLabel') },
                { value: '4.9', label: t('home.hero2.ratingLabel') },
                { value: '120+', label: t('home.statTravelers') },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-display text-3xl text-forest-dark dark:text-sand-light">{s.value}</div>
                  <div className="mt-1 text-[0.7rem] uppercase tracking-wider text-forest-dark/50 dark:text-sand-dark">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Collage column */}
        <div className="lg:col-span-7 relative lg:h-[76vh] min-h-[440px]">
          {/* main frame */}
          <Reveal variant="image" className="absolute inset-y-0 inset-x-0 lg:inset-x-auto lg:end-0 lg:w-4/5 rounded-[2.5rem] overflow-hidden shadow-soft-lg">
            {main ? (
              <Link to={`/reselieuChoisi/${main.id}/`} className="block h-full">
                <img
                  src={mediaUrl(main.image)}
                  alt={main.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-expo hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                <div className="absolute bottom-6 start-6 text-white">
                  <div className="text-xs font-bold uppercase tracking-wider text-sand-light/90 mb-1">
                    {main.city_name || t('home.hero2.featuredLocation')}
                  </div>
                  <h3 className="font-display text-3xl">{main.name}</h3>
                </div>
              </Link>
            ) : (
              <div className="w-full h-full bg-forest-dark/10 dark:bg-white/10 animate-pulse" />
            )}
          </Reveal>

          {/* overlapping small frame */}
          {second && (
            <Reveal
              delay={2}
              className="hidden sm:block absolute -bottom-8 -start-2 lg:start-0 lg:bottom-10 w-40 lg:w-52 rounded-[1.5rem] overflow-hidden shadow-soft border-4 border-cream dark:border-forest-darker z-10 aspect-[3/4]"
            >
              <Link to={`/reselieuChoisi/${second.id}/`} className="block h-full">
                <img
                  src={mediaUrl(second.image)}
                  alt={second.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Link>
            </Reveal>
          )}

          {/* floating quote chip */}
          <Reveal delay={3} className="hidden md:flex absolute -top-6 -end-0 lg:-end-6 glass-panel rounded-full px-5 py-3 items-center gap-2 z-20">
            <i className="bi bi-patch-check-fill text-copper"></i>
            <span className="text-xs font-semibold text-forest-dark dark:text-sand-light">
              {t('home.hero2.featuredLocation')}
            </span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ----------------------- Destination spotlight --------------------- */

function Spotlight({ t, destinations }) {
  const d = destinations[0];
  if (!d) return null;
  return (
    <section className="py-24 md:py-32 bg-white dark:bg-forest-darker">
      <div className="container-site grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <Reveal variant="image" className="lg:col-span-6 rounded-[2rem] overflow-hidden shadow-soft">
          <img src={mediaUrl(d.image)} alt={d.name} className="w-full h-[52vh] object-cover" loading="lazy" />
        </Reveal>

        <div className="lg:col-span-6">
          <Reveal>
            <div className="flex items-center gap-4 mb-5">
              <span className="font-mono text-sm text-terracotta">01</span>
              <span className="h-px w-10 bg-terracotta/40" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-terracotta">{t('dest.kicker')}</span>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="font-display text-4xl md:text-5xl text-forest-dark dark:text-sand-light leading-tight mb-6">
              {t('home.grid.title')}
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="text-lg text-forest-dark/60 dark:text-sand-dark leading-relaxed max-w-lg mb-8">
              {t('home.grid.subtitle')}
            </p>
          </Reveal>

          <Reveal delay={2}>
            <div className="rounded-2xl border border-forest-dark/10 dark:border-white/10 p-6 mb-8 max-w-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-display text-2xl text-forest-dark dark:text-sand-light">{d.name}</h4>
                <span className="text-copper font-semibold text-sm">{t('common.from')} {formatPrice(d.price)}</span>
              </div>
              <p className="text-sm text-forest-dark/60 dark:text-sand-dark line-clamp-3">{d.description}</p>
              <Link
                to={`/reselieuChoisi/${d.id}/`}
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-terracotta hover:gap-3 transition-all"
              >
                {t('cta.details')} <i className="bi bi-arrow-right rtl:rotate-180"></i>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={3}>
            <Link
              to="/destinations/"
              className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-forest-dark dark:text-sand-light hover:text-terracotta transition-colors"
            >
              {t('cta.seeMore')} <i className="bi bi-arrow-right rtl:rotate-180 group-hover:translate-x-1 transition-transform"></i>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* --------------------- Circuits — editorial list ------------------- */

function Circuits({ t }) {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.packs().then(setPacks).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-sand-light/60 dark:bg-white/[0.02]">
        <div className="container-site flex justify-center py-16"><Spinner /></div>
      </section>
    );
  }
  if (!packs.length) return null;

  const [main, ...rest] = packs;
  const list = rest.slice(0, 3);

  return (
    <section id="circuits" className="py-24 md:py-32 bg-sand-light/60 dark:bg-white/[0.02]">
      <div className="container-site">
        <Reveal>
          <div className="flex items-center gap-4 mb-5">
            <span className="font-mono text-sm text-terracotta">02</span>
            <span className="h-px w-10 bg-terracotta/40" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-terracotta">{t('home.circuits.kicker')}</span>
          </div>
        </Reveal>
        <Reveal delay={1}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <h2 className="font-display text-4xl md:text-5xl text-forest-dark dark:text-sand-light">
              {t('home.circuits.title')}
            </h2>
            <Link
              to="/circuit/"
              className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-terracotta hover:gap-3 transition-all"
            >
              {t('home.circuits.viewAll')} <i className="bi bi-arrow-right rtl:rotate-180"></i>
            </Link>
          </div>
        </Reveal>

        {/* Featured card */}
        <Reveal>
          <Link
            to={`/circuitChoisi/${main.id}/`}
            className="group grid grid-cols-1 md:grid-cols-12 gap-0 overflow-hidden rounded-[2rem] bg-white dark:bg-forest-dark shadow-card ring-1 ring-forest-dark/5 dark:ring-white/5 hover:-translate-y-1.5 hover:shadow-soft transition duration-300"
          >
            <div className="md:col-span-7 aspect-[16/10] md:aspect-auto overflow-hidden">
              <img
                src={mediaUrl(main.image || main.image_circuit)}
                alt={main.pack_name}
                className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="md:col-span-5 p-8 md:p-10 flex flex-col justify-center">
              <div className="text-forest-dark/50 dark:text-sand-dark text-sm font-medium mb-3">
                {main.date ? formatDate(main.date) : '—'}
              </div>
              <h3 className="font-display text-3xl text-forest-dark dark:text-sand-light mb-4 group-hover:text-terracotta transition-colors">
                {main.pack_name}
              </h3>
              <p className="text-forest-dark/60 dark:text-sand-dark line-clamp-3 mb-6">{main.description}</p>
              <div className="flex items-center justify-between">
                {main.price && (
                  <span className="text-copper font-bold text-lg">{formatPrice(main.price)}</span>
                )}
                <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-terracotta">
                  {t('cta.details')} <i className="bi bi-arrow-right rtl:rotate-180"></i>
                </span>
              </div>
            </div>
          </Link>
        </Reveal>

        {/* Editorial list */}
        {list.length > 0 && (
          <div className="mt-12 divide-y divide-forest-dark/10 dark:divide-white/10 border-y border-forest-dark/10 dark:border-white/10">
            {list.map((pack, idx) => (
              <Reveal key={pack.id} delay={idx}>
                <Link
                  to={`/circuitChoisi/${pack.id}/`}
                  className="group flex flex-col md:flex-row md:items-center gap-4 py-6 hover:bg-white/60 dark:hover:bg-white/[0.03] rounded-xl px-4 -mx-4 transition-colors"
                >
                  <span className="font-mono text-sm text-terracotta/70 w-8">{String(idx + 2).padStart(2, '0')}</span>
                  <div className="flex-1">
                    <h4 className="font-display text-xl text-forest-dark dark:text-sand-light group-hover:text-terracotta transition-colors">
                      {pack.pack_name}
                    </h4>
                    <p className="text-sm text-forest-dark/50 dark:text-sand-dark mt-1 line-clamp-1">{pack.description}</p>
                  </div>
                  <div className="flex items-center gap-6 md:gap-10 text-sm">
                    {pack.date && <span className="text-forest-dark/50 dark:text-sand-dark">{formatDate(pack.date)}</span>}
                    {pack.price && <span className="text-copper font-semibold">{formatPrice(pack.price)}</span>}
                    <span className="w-10 h-10 rounded-full border border-forest-dark/15 dark:border-white/20 flex items-center justify-center text-terracotta group-hover:bg-terracotta group-hover:text-white group-hover:border-terracotta transition-colors">
                      <i className="bi bi-arrow-right rtl:rotate-180"></i>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------------- Pilgrimage — light band -------------------- */

function Pilgrimage({ t }) {
  const features = [
    { icon: 'bi-buildings-fill', title: t('home.pilgrimage.feat1Title'), desc: t('home.pilgrimage.feat1Desc') },
    { icon: 'bi-people-fill', title: t('home.pilgrimage.feat2Title'), desc: t('home.pilgrimage.feat2Desc') },
  ];

  return (
    <section id="pilgrimage" className="py-24 md:py-32 bg-white dark:bg-forest-darker relative overflow-hidden">
      <div className="container-site grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        {/* Image collage */}
        <div className="relative h-[54vh] lg:h-[70vh]">
          <Reveal variant="image" className="absolute top-0 start-0 w-4/5 h-4/5 rounded-[2rem] overflow-hidden shadow-soft-lg z-10">
            <img
              src="https://images.unsplash.com/photo-1565552643982-27ce6f4ed6f6?auto=format&fit=crop&w=900&q=80"
              alt={t('hadj.title')}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </Reveal>
          <Reveal delay={2} className="absolute bottom-0 end-0 w-1/2 h-1/2 rounded-[1.5rem] overflow-hidden shadow-soft border-4 border-white dark:border-forest-darker z-20">
            <img
              src="https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&w=600&q=80"
              alt={t('hadj.titleArabic')}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </Reveal>
        </div>

        {/* Text */}
        <div>
          <Reveal>
            <div className="flex items-center gap-4 mb-5">
              <span className="font-mono text-sm text-terracotta">03</span>
              <span className="h-px w-10 bg-terracotta/40" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-terracotta">{t('home.pilgrimage.kicker')}</span>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-forest-dark dark:text-sand-light leading-tight mb-6">
              {t('home.pilgrimage.title1')}{' '}
              <span className="italic font-light text-forest-dark/30 dark:text-sand-dark/60">{t('home.pilgrimage.title2')}</span>
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="text-lg text-forest-dark/60 dark:text-sand-dark leading-relaxed max-w-lg mb-10">
              {t('home.pilgrimage.body')}
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-5 mb-10">
            {features.map((f, idx) => (
              <Reveal key={f.title} delay={idx + 1}>
                <div className="card p-6 h-full">
                  <div className="w-11 h-11 rounded-xl bg-copper/10 text-copper flex items-center justify-center mb-4">
                    <i className={`bi ${f.icon} text-lg`}></i>
                  </div>
                  <h4 className="font-semibold text-forest-dark dark:text-sand-light mb-1">{f.title}</h4>
                  <p className="text-sm text-forest-dark/60 dark:text-sand-dark">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={3}>
            <Link
              to="/hadj-omra/"
              className="btn bg-forest-dark text-sand-light px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-terracotta hover:text-white transition-colors duration-300"
            >
              {t('home.pilgrimage.cta')}
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------- Destinations grid ----------------------- */

function Destinations({ t, destinations, loading }) {
  return (
    <section id="destinations" className="py-24 bg-sand-light/60 dark:bg-white/[0.02]">
      <div className="container-site">
        <Reveal>
          <div className="flex items-center gap-4 mb-5">
            <span className="font-mono text-sm text-terracotta">04</span>
            <span className="h-px w-10 bg-terracotta/40" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-terracotta">{t('dest.kicker')}</span>
          </div>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="font-display text-4xl md:text-5xl text-forest-dark dark:text-sand-light mb-14">
            {t('home.grid.title')}
          </h2>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card h-80 animate-pulse bg-forest-dark/10 dark:bg-white/5" />
              ))
            : destinations.map((d) => <DestinationCard key={d.id} destination={d} />)}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Contact ----------------------------- */

function Contact({ t }) {
  const items = [
    { icon: 'bi-geo-alt', title: t('home.contactAddress'), body: 'El Bayadh, Algérie' },
    { icon: 'bi-envelope', title: t('home.contactEmail'), body: 'contact@elbayadhtravels.dz', href: 'mailto:contact@elbayadhtravels.dz' },
    { icon: 'bi-phone', title: t('home.contactPhone'), body: '+213 (0) 00 00 00 00' },
  ];

  return (
    <section id="contact" className="container-site py-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <Reveal>
          <span className="text-terracotta text-xs font-bold uppercase tracking-widest block mb-3">{t('contact.kicker')}</span>
          <h2 className="font-display text-4xl text-forest-dark dark:text-sand-light">{t('home.contact.title')}</h2>
          <p className="mt-3 text-forest-dark/60 dark:text-sand-dark">{t('home.contact.subtitle')}</p>
        </Reveal>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((c) => (
          <div key={c.title} className="card p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-copper/10 text-2xl text-copper">
              <i className={`bi ${c.icon}`}></i>
            </div>
            <h4 className="mt-4 text-lg font-semibold text-forest-dark dark:text-sand-light">{c.title}</h4>
            <div className="mx-auto my-4 h-px w-12 bg-copper/40" />
            {c.href ? (
              <a href={c.href} className="text-sm text-forest-dark/70 dark:text-sand-dark">{c.body}</a>
            ) : (
              <p className="text-sm text-forest-dark/70 dark:text-sand-dark">{c.body}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* --------------------------- Composition --------------------------- */

function HomeV1() {
  const { t } = useLanguage();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .destinations()
      .then(setDestinations)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Hero t={t} destinations={destinations} />
      <Spotlight t={t} destinations={destinations} />
      <Circuits t={t} />
      <Pilgrimage t={t} />
      <Destinations t={t} destinations={destinations} loading={loading} />

      <section id="weather" className="relative overflow-hidden bg-forest-darker py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgb(var(--c-copper)/0.06),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 pattern-zellige opacity-50" />
        <div className="container-site relative">
          <div className="text-center">
            <h2 className="font-display text-4xl md:text-5xl text-sand-light">{t('home.weather.title')}</h2>
            <p className="mt-3 text-sand-dark max-w-xl mx-auto">{t('home.weather.subtitle')}</p>
          </div>
          <div className="mt-10">
            <WeatherWidget initialCity="El Bayadh" />
          </div>
        </div>
      </section>

      <CtaBanner />
      <Contact t={t} />
    </>
  );
}

export default HomeV1;
