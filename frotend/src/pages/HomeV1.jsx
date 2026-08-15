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
/*  V1 — Éditorial Saharien                                           */
/*  Inspired by terres-touareg.com: immersive full-bleed hero, refined */
/*  sand/terracotta palette, editorial serif headlines, thin rules,    */
/*  generous whitespace, arch-masked imagery and zellige textures.     */
/* ------------------------------------------------------------------ */

/* ---------------------------- Hero -------------------------------- */

function Hero({ t, destinations }) {
  const [main, ...stack] = destinations;
  const second = stack[0];
  const featured = main;

  return (
    <section className="relative w-full h-[100svh] min-h-[760px] flex items-center overflow-hidden bg-cream dark:bg-forest-darker">
      {/* Background desert photography with parallax */}
      <div className="absolute inset-0 z-0">
        {featured ? (
          <div
            className="absolute inset-0 bg-cover bg-center scale-110"
            style={{ backgroundImage: `url(${mediaUrl(featured.image)})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1682687982185-531d09ec56fc?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center scale-110" />
        )}
        {/* Editorial gradient overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/40 to-transparent dark:from-forest-darker dark:via-forest-darker/40" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-cream to-transparent dark:from-forest-darker" />
      </div>

      <div className="relative z-10 w-full container-site flex flex-col justify-between h-full pb-16 pt-28">
        <div className="max-w-3xl">
          <Reveal>
            <p className="text-[0.75rem] uppercase tracking-[0.25em] text-forest-dark/70 dark:text-sand-dark border-l-2 border-terracotta pl-4 mb-6">
              {t('home.hero2.kicker')}
            </p>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="display-text text-forest-dark dark:text-sand-light leading-[0.95]">
              {t('home.hero2.title1')}
              <br />
              <span className="italic font-light text-forest-dark/40 dark:text-sand-dark/60">{t('home.hero2.title2')}</span>
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-8 text-lg md:text-xl text-forest-dark/70 dark:text-sand-dark max-w-lg font-light leading-relaxed">
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
        </div>

        <div className="flex items-end justify-between border-t border-forest-dark/15 dark:border-white/10 pt-6">
          <Reveal delay={2} className="flex items-center gap-4">
            <i className="bi bi-sun text-xl text-terracotta"></i>
            <p className="text-[0.7rem] uppercase tracking-widest text-forest-dark/60 dark:text-sand-dark leading-tight">
              Rooted in tradition.
              <br />
              Committed to responsible travel.
            </p>
          </Reveal>
          {featured && (
            <Reveal delay={3} className="hidden sm:block text-right">
              <div className="text-xs font-bold uppercase tracking-wider text-forest-dark/50 dark:text-sand-dark mb-1">
                {featured.city_name || t('home.hero2.featuredLocation')}
              </div>
              <div className="font-display text-2xl text-forest-dark dark:text-sand-light">{featured.name}</div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

/* ----------------------- Editorial intro -------------------------- */

function Intro({ t, destinations }) {
  const d = destinations[0];
  return (
    <section className="py-24 lg:py-32 border-b border-forest-dark/10 dark:border-white/10 bg-cream dark:bg-forest-darker">
      <div className="container-site grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        <Reveal>
          <p className="text-overline-custom mb-6">{t('home.editorial.title1')}</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-forest-dark dark:text-sand-light leading-[1.05] mb-8">
            {t('home.editorial.title1')}
            <br />
            <span className="italic font-light text-forest-dark/40 dark:text-sand-dark/60">{t('home.editorial.title2')}</span>
          </h2>
          <p className="text-forest-dark/60 dark:text-sand-dark leading-relaxed max-w-md">
            {t('home.editorial.body')}
          </p>
        </Reveal>
        <Reveal delay={1} variant="image" className="relative h-[400px] lg:h-[500px] w-full rounded-[2rem] overflow-hidden shadow-soft">
          {d ? (
            <img src={mediaUrl(d.image)} alt={d.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="absolute inset-0 bg-forest-dark/10 dark:bg-white/10 animate-pulse" />
          )}
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------------- Destination spotlight --------------------- */

function Spotlight({ t, destinations }) {
  const d = destinations[0];
  if (!d) return null;
  return (
    <section className="py-24 md:py-32 bg-white dark:bg-forest-dark relative overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -end-24 w-[34rem] h-[34rem] opacity-[0.05] pattern-zellige" />
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
    <section id="circuits" className="py-24 md:py-32 bg-sand-light/60 dark:bg-white/[0.02] border-b border-forest-dark/10 dark:border-white/10">
      <div className="container-site">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <Reveal>
              <div className="flex items-center gap-4 mb-5">
                <span className="font-mono text-sm text-terracotta">02</span>
                <span className="h-px w-10 bg-terracotta/40" />
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-terracotta">{t('home.circuits.kicker')}</span>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <h2 className="font-display text-4xl md:text-5xl text-forest-dark dark:text-sand-light">
                {t('home.circuits.title')}
              </h2>
            </Reveal>
          </div>
          <Reveal delay={1}>
            <Link
              to="/circuit/"
              className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-terracotta hover:gap-3 transition-all"
            >
              {t('home.circuits.viewAll')} <i className="bi bi-arrow-right rtl:rotate-180"></i>
            </Link>
          </Reveal>
        </div>

        {/* Featured card */}
        <Reveal>
          <Link
            to={`/circuitChoisi/${main.id}/`}
            className="group grid grid-cols-1 md:grid-cols-12 gap-0 overflow-hidden rounded-[2rem] bg-white dark:bg-forest-dark shadow-card ring-1 ring-forest-dark/5 dark:ring-white/5 hover:-translate-y-1.5 hover:shadow-soft transition duration-300"
          >
            <div className="md:col-span-7 aspect-[16/10] md:aspect-auto overflow-hidden relative">
              <span className="absolute top-4 left-4 z-10 bg-terracotta text-white text-[0.6rem] uppercase tracking-widest px-3 py-1.5 rounded-full">
                {t('circuit.featured')}
              </span>
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
    <section id="pilgrimage" className="py-24 md:py-32 bg-white dark:bg-forest-dark relative overflow-hidden border-b border-forest-dark/10 dark:border-white/10">
      <div className="container-site grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
        {/* Image collage — arch masked */}
        <div className="lg:col-span-5 relative h-[54vh] lg:h-[70vh]">
          <Reveal variant="image" className="absolute top-0 start-0 w-4/5 h-4/5 rounded-t-[9999px] overflow-hidden shadow-soft-lg z-10">
            <img
              src="https://images.unsplash.com/photo-1565552643982-26178cb6890d?auto=format&fit=crop&w=900&q=80"
              alt={t('hadj.title')}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </Reveal>
          <Reveal delay={2} className="absolute bottom-0 end-0 w-1/2 h-1/2 rounded-[1.5rem] overflow-hidden shadow-soft border-4 border-white dark:border-forest-dark z-20">
            <img
              src="https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&w=600&q=80"
              alt={t('hadj.titleArabic')}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </Reveal>
        </div>

        {/* Text */}
        <div className="lg:col-span-7">
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
              <span className="italic font-light text-forest-dark/40 dark:text-sand-dark/60">{t('home.pilgrimage.title2')}</span>
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
    <section id="destinations" className="py-24 bg-sand-light/60 dark:bg-white/[0.02] border-b border-forest-dark/10 dark:border-white/10">
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
      <Intro t={t} destinations={destinations} />
      <Spotlight t={t} destinations={destinations} />
      <Circuits t={t} />
      <Pilgrimage t={t} />
      <Destinations t={t} destinations={destinations} loading={loading} />

      <section id="weather" className="relative overflow-hidden bg-forest-darker py-20 border-b border-forest-dark/10 dark:border-white/10">
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
