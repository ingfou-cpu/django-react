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
/*  V2 — Sahara immersif                                               */
/*  Dark cinematic on forest-darker. Copper/gold glow, zellige texture, */
/*  full-viewport hero, pilgrimage as the immersive centerpiece.        */
/* ------------------------------------------------------------------ */

/* --------------------------- Dark hero ----------------------------- */

function Hero({ t, destinations }) {
  const d = destinations[0];

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-forest-darker pt-24">
      {/* Backdrop image */}
      {d && (
        <img
          src={mediaUrl(d.image)}
          alt={d.name}
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
      )}
      {/* Layered gradients + texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-forest-darker/70 via-forest-darker/55 to-forest-darker" />
      <div className="absolute inset-0 bg-gradient-to-r from-forest-darker/80 via-transparent to-forest-darker/80" />
      <div className="pointer-events-none absolute inset-0 pattern-zellige opacity-40" />
      <div className="pointer-events-none absolute top-1/4 -start-20 w-[26rem] h-[26rem] bg-terracotta/10 rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 end-0 w-[30rem] h-[30rem] bg-copper/10 rounded-full blur-[140px]" />

      <div className="container-site relative z-10 text-center max-w-4xl mx-auto py-24">
        <Reveal>
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/15 bg-white/5 backdrop-blur text-xs font-bold uppercase tracking-[0.25em] text-sand-light mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse" />
            {t('home.hero2.kicker')}
          </div>
        </Reveal>

        <Reveal delay={1}>
          <h1 className="font-display display-text text-sand-light leading-[0.92]">
            Silence <br />
            <span className="text-sand-dark italic font-light">&amp;</span> Sand.
          </h1>
        </Reveal>

        <Reveal delay={2}>
          <p className="mt-8 text-lg md:text-2xl text-sand-dark font-light max-w-2xl mx-auto leading-relaxed">
            {t('home.hero2.tagline')}
          </p>
        </Reveal>

        <Reveal delay={3}>
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/circuit/"
              className="btn bg-terracotta text-white px-9 py-4 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-white hover:text-forest-darker transition-colors duration-300 shadow-glow"
            >
              {t('home.hero2.cta')}
            </Link>
            <Link
              to="/hadj-omra/"
              className="btn px-9 py-4 rounded-full text-sm font-bold uppercase tracking-wider border border-white/20 text-sand-light hover:border-terracotta hover:text-terracotta transition-colors"
            >
              <i className="bi bi-moon-stars-fill me-2"></i>{t('home.pilgrimage.cta')}
            </Link>
          </div>
        </Reveal>

        <Reveal delay={3}>
          <div className="mt-16 flex items-center justify-center gap-10">
            {[
              { value: '15+', label: t('home.hero2.yearsLabel') },
              { value: '4.9', label: t('home.hero2.ratingLabel') },
              { value: '120+', label: t('home.statTravelers') },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-display text-3xl md:text-4xl text-copper">{s.value}</div>
                <div className="mt-1 text-[0.68rem] uppercase tracking-widest text-sand-dark">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sand-dark flex flex-col items-center gap-2 text-xs uppercase tracking-widest">
        <span>{t('cta.details')}</span>
        <i className="bi bi-chevron-down animate-bounce"></i>
      </div>
    </section>
  );
}

/* ----------------------- Editorial quote strip --------------------- */

function Quote({ t }) {
  return (
    <section className="bg-forest-darker border-y border-white/5 py-24 md:py-32">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <Reveal>
          <div className="mx-auto mb-8 w-12 h-12 rounded-full border border-copper/30 flex items-center justify-center">
            <i className="bi bi-star-fill text-copper text-lg"></i>
          </div>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl text-sand-light leading-tight mb-8">
            {t('home.editorial.title1')} <br />
            <span className="text-sand-dark italic font-light">{t('home.editorial.title2')}</span>
          </h2>
        </Reveal>
        <Reveal delay={2}>
          <p className="text-sand-dark text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            {t('home.editorial.body')}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------ Circuits — dark cards -------------------- */

function Circuits({ t }) {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.packs().then(setPacks).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-forest-darker">
        <div className="container-site flex justify-center py-16"><Spinner /></div>
      </section>
    );
  }
  if (!packs.length) return null;

  const [main, ...rest] = packs;
  const grid = rest.slice(0, 2);

  return (
    <section id="circuits" className="py-24 md:py-32 bg-forest-darker relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgb(var(--c-copper)/0.07),transparent_45%)]" />
      <div className="container-site relative">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <span className="text-terracotta text-xs font-bold uppercase tracking-[0.25em] block mb-3">
                {t('home.circuits.kicker')}
              </span>
              <h2 className="font-display text-4xl md:text-5xl text-sand-light">{t('home.circuits.title')}</h2>
            </div>
            <Link
              to="/circuit/"
              className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-terracotta hover:gap-3 transition-all"
            >
              {t('home.circuits.viewAll')} <i className="bi bi-arrow-right rtl:rotate-180"></i>
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Featured card — spans both columns visually via large text */}
          <Reveal className="md:col-span-2">
            <Link
              to={`/circuitChoisi/${main.id}/`}
              className="group relative block overflow-hidden rounded-[2rem] bg-forest-dark ring-1 ring-white/10 hover:-translate-y-1.5 hover:shadow-soft transition duration-300"
            >
              <div className="aspect-[21/9] overflow-hidden">
                <img
                  src={mediaUrl(main.image || main.image_circuit)}
                  alt={main.pack_name}
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-darker via-forest-darker/40 to-transparent" />
              </div>
              <div className="absolute bottom-0 inset-x-0 p-6 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <div className="text-sand-dark text-sm font-medium mb-2">
                    {main.date ? formatDate(main.date) : '—'}
                  </div>
                  <h3 className="font-display text-3xl md:text-4xl text-sand-light group-hover:text-terracotta transition-colors">
                    {main.pack_name}
                  </h3>
                </div>
                <div className="flex items-center gap-6">
                  {main.price && (
                    <span className="text-copper font-bold text-xl">{formatPrice(main.price)}</span>
                  )}
                  <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-terracotta">
                    {t('cta.details')} <i className="bi bi-arrow-right rtl:rotate-180"></i>
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>

          {grid.map((pack, idx) => (
            <Reveal key={pack.id} delay={idx + 1}>
              <Link
                to={`/circuitChoisi/${pack.id}/`}
                className="group block overflow-hidden rounded-2xl bg-forest-dark ring-1 ring-white/10 hover:-translate-y-1 transition duration-300 h-full"
              >
                {pack.image && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={mediaUrl(pack.image)}
                      alt={pack.pack_name}
                      className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-display text-2xl text-sand-light group-hover:text-terracotta transition-colors mb-2">
                    {pack.pack_name}
                  </h3>
                  <p className="text-sm text-sand-dark line-clamp-2 mb-4">{pack.description}</p>
                  <div className="flex items-center justify-between">
                    {pack.price && <span className="text-copper font-semibold">{formatPrice(pack.price)}</span>}
                    <span className="text-xs text-sand-dark">{pack.date ? formatDate(pack.date) : ''}</span>
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

/* ------------------- Pilgrimage — immersive centerpiece ------------ */

function Pilgrimage({ t }) {
  const features = [
    { title: t('home.pilgrimage.feat1Title'), desc: t('home.pilgrimage.feat1Desc') },
    { title: t('home.pilgrimage.feat2Title'), desc: t('home.pilgrimage.feat2Desc') },
  ];

  return (
    <section id="pilgrimage" className="py-28 md:py-40 bg-forest-dark text-sand-light relative overflow-hidden">
      <div className="pointer-events-none absolute top-0 right-0 w-[45vw] h-[45vw] bg-copper/8 rounded-full blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-[30vw] h-[30vw] bg-terracotta/8 rounded-full blur-[100px]" />
      <div className="pointer-events-none absolute inset-0 pattern-star opacity-25" />

      <div className="container-site relative grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Image collage */}
        <div className="relative h-[56vh] lg:h-[76vh]">
          <Reveal variant="image" className="absolute top-0 end-0 w-3/4 h-3/4 rounded-[2rem] overflow-hidden shadow-2xl z-10">
            <img
              src="https://images.unsplash.com/photo-1565552643982-27ce6f4ed6f6?auto=format&fit=crop&w=900&q=80"
              alt={t('hadj.title')}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </Reveal>
          <Reveal delay={2} className="absolute bottom-0 start-0 w-2/3 h-1/2 rounded-[1.5rem] overflow-hidden shadow-2xl border-4 border-forest-dark z-20">
            <img
              src="https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&w=700&q=80"
              alt={t('hadj.titleArabic')}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </Reveal>
          {/* Arabic watermark */}
          <Reveal delay={3} className="absolute -bottom-6 -end-2 font-arabic text-5xl md:text-6xl text-sand-light/10 select-none">
            الحج والعمرة
          </Reveal>
        </div>

        {/* Content */}
        <div className="order-2 lg:order-1">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-copper/30 rounded-full text-xs font-medium tracking-widest uppercase mb-8">
              <i className="bi bi-moon-stars-fill text-copper"></i>
              {t('home.pilgrimage.kicker')}
            </div>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight mb-8">
              {t('home.pilgrimage.title1')} <br />
              <span className="text-copper italic font-light">{t('home.pilgrimage.title2')}</span>
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="text-sand-dark text-lg mb-10 max-w-md font-light leading-relaxed">
              {t('home.pilgrimage.body')}
            </p>
          </Reveal>

          <ul className="space-y-6 mb-12">
            {features.map((f, idx) => (
              <Reveal key={f.title} delay={idx + 1}>
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-copper/20 border border-copper/40 flex items-center justify-center shrink-0 mt-0.5">
                    <i className="bi bi-check text-xs text-copper"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-1">{f.title}</h4>
                    <p className="text-sm text-sand-dark">{f.desc}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={3}>
            <Link
              to="/hadj-omra/"
              className="btn bg-white text-forest-darker px-9 py-4 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-terracotta hover:text-white transition-colors duration-300"
            >
              {t('home.pilgrimage.cta')}
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* --------------------- Destinations — dark section ----------------- */

function Destinations({ t, destinations, loading }) {
  return (
    <section id="destinations" className="py-24 md:py-32 bg-forest-darker">
      <div className="container-site">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <span className="text-terracotta text-xs font-bold uppercase tracking-[0.25em] block mb-3">
                {t('dest.kicker')}
              </span>
              <h2 className="font-display text-4xl md:text-5xl text-sand-light">{t('home.grid.title')}</h2>
            </div>
            <Link
              to="/destinations/"
              className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-terracotta hover:gap-3 transition-all"
            >
              {t('cta.seeMore')} <i className="bi bi-arrow-right rtl:rotate-180"></i>
            </Link>
          </div>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card h-80 animate-pulse bg-white/5" />
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
    <section id="contact" className="py-24 bg-forest-darker">
      <div className="container-site">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Reveal>
            <span className="text-terracotta text-xs font-bold uppercase tracking-widest block mb-3">{t('contact.kicker')}</span>
            <h2 className="font-display text-4xl text-sand-light">{t('home.contact.title')}</h2>
            <p className="mt-3 text-sand-dark">{t('home.contact.subtitle')}</p>
          </Reveal>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((c) => (
            <div key={c.title} className="rounded-3xl bg-forest-dark ring-1 ring-white/10 p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-copper/15 text-2xl text-copper">
                <i className={`bi ${c.icon}`}></i>
              </div>
              <h4 className="mt-4 text-lg font-semibold text-sand-light">{c.title}</h4>
              <div className="mx-auto my-4 h-px w-12 bg-copper/40" />
              {c.href ? (
                <a href={c.href} className="text-sm text-sand-dark">{c.body}</a>
              ) : (
                <p className="text-sm text-sand-dark">{c.body}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Composition --------------------------- */

function HomeV2() {
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
      <Quote t={t} />
      <Circuits t={t} />
      <Pilgrimage t={t} />
      <Destinations t={t} destinations={destinations} loading={loading} />

      <section id="weather" className="relative overflow-hidden bg-forest-darker py-20 border-t border-white/5">
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

export default HomeV2;
