import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api.js';
import { mediaUrl, formatPrice } from '../lib/format.jsx';
import { useLanguage } from '../lib/i18n.jsx';
import Reveal from '../components/Reveal.jsx';
import DestinationCard from '../components/DestinationCard.jsx';
import WeatherWidget from '../components/WeatherWidget.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import Spinner from '../components/Spinner.jsx';

/* ------------------------------------------------------------------ */
/*  V3 — Bento réservation                                             */
/*  Bright, modular, conversion-focused. Quick-search hero, mixed-size */
/*  bento grid, price-forward circuit cards, "why us" strip.           */
/* ------------------------------------------------------------------ */

/* ---------------------- Hero + quick search ------------------------ */

function Hero({ t }) {
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  const submit = (e) => {
    e.preventDefault();
    navigate(q.trim() ? `/search/?q=${encodeURIComponent(q.trim())}` : '/search/');
  };

  return (
    <section className="relative overflow-hidden bg-sand-light/60 dark:bg-forest-darker pt-24 lg:pt-28 pb-16 lg:pb-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgb(var(--c-copper)/0.10),transparent_45%)]" />

      <div className="container-site relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
        <div className="lg:col-span-7">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-copper/10 text-copper text-xs font-bold uppercase tracking-[0.2em] mb-7">
              <i className="bi bi-patch-check-fill"></i> {t('home.hero2.kicker')}
            </div>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-forest-dark dark:text-sand-light leading-[1.02]">
              {t('home.editorial.title1')} <br />
              <span className="text-copper italic font-light">{t('home.editorial.title2')}</span>
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-6 max-w-lg text-lg text-forest-dark/70 dark:text-sand-dark leading-relaxed">
              {t('home.hero2.tagline')}
            </p>
          </Reveal>
          <Reveal delay={3}>
            <div className="mt-9 flex flex-col sm:flex-row gap-4">
              <Link to="/destinations/" className="btn-primary px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider">
                {t('home.hero.ctaDestinations')}
              </Link>
              <Link to="/circuit/" className="btn-outline px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider">
                {t('home.hero.ctaCircuits')}
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Quick-search widget */}
        <div className="lg:col-span-5">
          <Reveal delay={2}>
            <form
              onSubmit={submit}
              className="card p-6 md:p-8 rounded-3xl shadow-soft-lg max-w-md w-full lg:ms-auto"
            >
              <div className="flex items-center gap-2 text-terracotta mb-5">
                <i className="bi bi-search"></i>
                <span className="text-xs font-bold uppercase tracking-widest">{t('search.kicker')}</span>
              </div>

              <label className="label" htmlFor="v3-city">{t('common.destination')}</label>
              <div className="relative mt-2">
                <i className="bi bi-geo-alt absolute start-4 top-1/2 -translate-y-1/2 text-forest-dark/40 dark:text-sand-dark"></i>
                <input
                  id="v3-city"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t('search.placeholder')}
                  className="input !ps-11"
                />
              </div>

              <button
                type="submit"
                className="mt-5 w-full btn-primary rounded-full py-4 text-sm font-bold uppercase tracking-wider"
              >
                <i className="bi bi-arrow-right me-2 rtl:rotate-180"></i>
                {t('common.search')}
              </button>

              <p className="mt-4 text-center text-xs text-forest-dark/50 dark:text-sand-dark">
                {t('home.hero.featGuided')} · {t('home.hero.featNomad')} · {t('home.hero.featTransport')}
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* --------------------- Destinations — bento grid ------------------- */

function Bento({ t, destinations, loading }) {
  const [main, ...rest] = destinations;
  const tiles = rest.slice(0, 4);

  return (
    <section id="destinations" className="py-24 bg-white dark:bg-forest-darker">
      <div className="container-site">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-terracotta text-xs font-bold uppercase tracking-widest block mb-3">{t('dest.kicker')}</span>
              <h2 className="font-display text-4xl md:text-5xl text-forest-dark dark:text-sand-light">{t('home.grid.title')}</h2>
            </div>
            <Link
              to="/destinations/"
              className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-terracotta hover:gap-3 transition-all"
            >
              {t('cta.seeMore')} <i className="bi bi-arrow-right rtl:rotate-180"></i>
            </Link>
          </div>
        </Reveal>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`card animate-pulse bg-forest-dark/10 dark:bg-white/5 ${i === 0 ? 'lg:col-span-2 lg:row-span-2 h-96' : 'h-48'}`} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[10rem] gap-4">
            {/* Main hero tile */}
            {main && (
              <Reveal className="sm:col-span-2 row-span-2">
                <Link
                  to={`/reselieuChoisi/${main.id}/`}
                  className="group relative block h-full overflow-hidden rounded-3xl shadow-card ring-1 ring-forest-dark/5 dark:ring-white/5 hover:-translate-y-1 hover:shadow-soft transition duration-300"
                >
                  <img
                    src={mediaUrl(main.image)}
                    alt={main.name}
                    className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 p-6 text-white">
                    <span className="badge bg-white/15 backdrop-blur mb-3">
                      <i className="bi bi-geo-alt"></i> {main.city_name || 'Algérie'}
                    </span>
                    <h3 className="font-display text-2xl md:text-3xl">{main.name}</h3>
                    <p className="mt-1 text-sm text-white/80 line-clamp-2">{main.description}</p>
                    {main.price && <span className="mt-3 inline-block text-copper-light font-semibold">{t('common.from')} {formatPrice(main.price)}</span>}
                  </div>
                </Link>
              </Reveal>
            )}

            {tiles.map((d, idx) => (
              <Reveal key={d.id} delay={idx + 1}>
                <Link
                  to={`/reselieuChoisi/${d.id}/`}
                  className="group relative block h-full overflow-hidden rounded-3xl shadow-card ring-1 ring-forest-dark/5 dark:ring-white/5 hover:-translate-y-1 hover:shadow-soft transition duration-300"
                >
                  <img
                    src={mediaUrl(d.image)}
                    alt={d.name}
                    className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                  <div className="absolute bottom-0 p-4 text-white">
                    <h3 className="font-display text-lg">{d.name}</h3>
                    {d.price && <span className="text-xs text-copper-light font-semibold">{t('common.from')} {formatPrice(d.price)}</span>}
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

/* ------------------------------ Why us ----------------------------- */

function WhyUs({ t }) {
  const features = [
    { icon: 'bi-compass-fill', title: t('home.hero.featGuided'), desc: t('about.value.securityBody') },
    { icon: 'bi-sunset-fill', title: t('home.hero.featNomad'), desc: t('about.value.passionBody') },
    { icon: 'bi-truck', title: t('home.hero.featTransport'), desc: t('about.value.reliabilityBody') },
    { icon: 'bi-shield-lock-fill', title: t('nav.payments'), desc: t('about.value.transparencyBody') },
  ];

  return (
    <section className="py-20 bg-sand-light/60 dark:bg-white/[0.02]">
      <div className="container-site grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, idx) => (
          <Reveal key={f.title} delay={idx}>
            <div className="flex gap-4">
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-copper/10 text-copper flex items-center justify-center text-xl">
                <i className={`bi ${f.icon}`}></i>
              </div>
              <div>
                <h4 className="font-semibold text-forest-dark dark:text-sand-light mb-1">{f.title}</h4>
                <p className="text-sm text-forest-dark/60 dark:text-sand-dark">{f.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* -------------------- Circuits — price-forward --------------------- */

function Circuits({ t }) {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.packs().then(setPacks).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-white dark:bg-forest-darker">
        <div className="container-site flex justify-center py-16"><Spinner /></div>
      </section>
    );
  }
  if (!packs.length) return null;

  return (
    <section id="circuits" className="py-24 bg-white dark:bg-forest-darker">
      <div className="container-site">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-terracotta text-xs font-bold uppercase tracking-widest block mb-3">{t('home.circuits.kicker')}</span>
              <h2 className="font-display text-4xl md:text-5xl text-forest-dark dark:text-sand-light">{t('home.circuits.title')}</h2>
            </div>
            <Link
              to="/circuit/"
              className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-terracotta hover:gap-3 transition-all"
            >
              {t('home.circuits.viewAll')} <i className="bi bi-arrow-right rtl:rotate-180"></i>
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {packs.slice(0, 6).map((pack, idx) => (
            <Reveal key={pack.id} delay={idx}>
              <Link
                to={`/circuitChoisi/${pack.id}/`}
                className="card group block overflow-hidden hover:-translate-y-1.5 hover:shadow-soft transition duration-300 h-full"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={mediaUrl(pack.image || pack.image_circuit)}
                    alt={pack.pack_name}
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  {pack.price && (
                    <span className="absolute top-3 end-3 badge bg-white/90 text-forest-dark font-semibold shadow-card">
                      {formatPrice(pack.price)}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl text-forest-dark dark:text-sand-light group-hover:text-terracotta transition-colors mb-1">
                    {pack.pack_name}
                  </h3>
                  <p className="text-sm text-forest-dark/60 dark:text-sand-dark line-clamp-2">{pack.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-medium text-forest-dark/50 dark:text-sand-dark">{t('circuit.featured')}</span>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-copper transition group-hover:gap-2">
                      {t('cta.details')} <i className="bi bi-arrow-right"></i>
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------- Pilgrimage — promo band ------------------- */

function Pilgrimage({ t }) {
  return (
    <section id="pilgrimage" className="container-site pb-24">
      <Reveal>
        <Link
          to="/hadj-omra/"
          className="group relative block overflow-hidden rounded-[2.5rem] shadow-soft-lg"
        >
          <div className="aspect-[16/7] md:aspect-[21/8] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&w=1400&q=80"
              alt={t('hadj.title')}
              className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-forest-darker/90 via-forest-darker/55 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-14 max-w-xl">
            <div className="inline-flex items-center gap-2 w-fit px-3 py-1 rounded-full border border-copper/40 bg-forest-darker/40 backdrop-blur text-xs font-medium tracking-widest uppercase mb-5">
              <i className="bi bi-moon-stars-fill text-copper"></i>
              {t('home.pilgrimage.kicker')}
            </div>
            <h3 className="font-display text-3xl md:text-5xl text-sand-light leading-tight mb-4">
              {t('home.pilgrimage.title1')} <span className="text-copper italic font-light">{t('home.pilgrimage.title2')}</span>
            </h3>
            <p className="text-sand-dark text-base md:text-lg max-w-md mb-8 line-clamp-3">{t('home.pilgrimage.body')}</p>
            <span className="btn bg-terracotta text-white px-7 py-3.5 rounded-full w-fit text-sm font-bold uppercase tracking-wider hover:bg-white hover:text-forest-darker transition-colors duration-300">
              {t('home.pilgrimage.cta')}
            </span>
          </div>
        </Link>
      </Reveal>
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

function HomeV3() {
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
      <Hero t={t} />
      <WhyUs t={t} />
      <Bento t={t} destinations={destinations} loading={loading} />
      <Circuits t={t} />
      <Pilgrimage t={t} />

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

export default HomeV3;
