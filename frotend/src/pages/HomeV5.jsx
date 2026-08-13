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
import SectionTitle from '../components/SectionTitle.jsx';

/* ------------------------------------------------------------------ */
/*  V5 — Dark Cinematic Sahara                                        */
/*  Deep forest/charcoal palette, copper glow, full-bleed imagery,    */
/*  oversized display type, immersive dark bands, atmospheric motion.  */
/* ------------------------------------------------------------------ */

/* ----------------------------- Hero --------------------------------- */

function Hero({ t, destinations }) {
  const [main, ...stack] = destinations;
  const second = stack[0];
  const third = stack[1];

  return (
    <section
      className="relative overflow-hidden bg-forest-darker pt-28 lg:pt-32 pb-20 lg:pb-28"
      aria-labelledby="hero-title"
    >
      {/* Atmospheric copper glow blobs */}
      <div
        className="pointer-events-none absolute -top-40 -start-20 w-[40rem] h-[40rem] opacity-[0.15] blur-[120px] rounded-full"
        style={{ background: 'rgb(var(--c-copper))' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 -end-20 w-[30rem] h-[30rem] opacity-[0.1] blur-[120px] rounded-full"
        style={{ background: 'rgb(var(--c-copper))' }}
        aria-hidden="true"
      />
      {/* Subtle zellige texture overlay */}
      <div className="pointer-events-none absolute inset-0 pattern-zellige opacity-[0.03]" aria-hidden="true" />

      <div className="container-site relative">
        {/* Full-bleed image background with overlay */}
        {main && (
          <div className="absolute inset-0 -z-10">
            <img
              src={mediaUrl(main.image)}
              alt=""
              className="w-full h-full object-cover"
              aria-hidden="true"
            />
            {/* Gradient overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-forest-darker/95 via-forest-darker/80 to-forest-darker/60" />
            {/* Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
        )}

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end min-h-[80vh] lg:min-h-[90vh]">
          {/* Text column - left, oversized */}
          <div className="lg:col-span-7 z-10 pb-16 lg:pb-0">
            <Reveal className="mb-8">
              <div className="flex items-center gap-3">
                <span className="h-px w-12" style={{ background: 'rgb(var(--c-copper))' }} />
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-copper">
                  {t('home.hero2.kicker')}
                </span>
              </div>
            </Reveal>

            <Reveal delay={1} id="hero-title">
              <h1 className="font-display display-text text-sand-light leading-[0.88] tracking-tight max-w-4xl">
                {t('home.hero2.tagline').split(' ').slice(0, -1).join(' ')}
                <br />
                <span className="italic font-light text-copper/80">{t('home.hero2.tagline').split(' ').pop()}</span>
              </h1>
            </Reveal>

            <Reveal delay={2} className="mt-8 max-w-xl">
              <p className="text-lg md:text-xl leading-relaxed text-sand-dark">
                {t('home.editorial.body')}
              </p>
            </Reveal>

            <Reveal delay={3} className="mt-12 flex flex-col sm:flex-row gap-4">
              <Link
                to="/circuit/"
                className="group btn bg-copper text-forest-darker px-10 py-5 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-copper-light hover:shadow-glow transition-all duration-300"
              >
                {t('home.hero2.cta')}
                <i className="bi bi-arrow-right rtl:rotate-180 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Link>
              <Link
                to="/destinations/"
                className="btn-ghost text-sand-light hover:text-copper border-sand-dark/30 hover:border-copper items-center gap-2 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider"
              >
                <i className="bi bi-geo-alt" aria-hidden="true" />
                {t('nav.destinations')}
              </Link>
            </Reveal>

            {/* Stats bar - minimal, elegant */}
            <Reveal delay={3} className="mt-16 flex gap-10 lg:gap-16 border-t border-white/10 pt-10">
              {[
                { value: '15+', label: t('home.hero2.yearsLabel') },
                { value: '4.9', label: t('home.hero2.ratingLabel') },
                { value: '120+', label: t('home.statTravelers') },
              ].map((s) => (
                <div key={s.label} className="flex flex-col">
                  <div className="font-display text-4xl lg:text-5xl text-sand-light tracking-tight">{s.value}</div>
                  <div className="mt-2 text-xs uppercase tracking-[0.2em] text-sand-dark">{s.label}</div>
                </div>
              ))}
            </Reveal>
          </div>

          {/* Right column - featured destination card overlay */}
          <div className="lg:col-span-5 relative">
            {main && (
              <Reveal variant="image" className="relative rounded-[2.5rem] overflow-hidden shadow-[0_60px_120px_-30px_rgb(var(--c-forest-darker)/0.6)] ring-1 ring-white/5 hover:ring-copper/20 transition-all duration-500">
                <Link to={`/reselieuChoisi/${main.id}/`} className="block h-full" aria-label={`${t('cta.details')}: ${main.name}`}>
                  <img
                    src={mediaUrl(main.image)}
                    alt={main.name}
                    className="w-full h-[520px] lg:h-[620px] object-cover transition-transform duration-1000 ease-expo hover:scale-105"
                    loading="eager"
                  />
                  {/* Gradient overlay on image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-darker/90 via-transparent to-transparent" />
                  <div className="absolute bottom-0 start-0 end-0 p-8">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-copper/20 text-copper rounded-full backdrop-blur-sm">
                        {main.city_name || t('home.hero2.featuredLocation')}
                      </span>
                      {main.rating && (
                        <span className="flex items-center gap-1 text-copper text-sm font-semibold">
                          <i className="bi bi-star-fill" aria-hidden="true" />
                          {main.rating}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-3xl lg:text-4xl text-sand-light leading-tight">{main.name}</h3>
                    <div className="mt-4 flex items-center gap-6 text-sand-dark">
                      {main.duration && (
                        <span className="flex items-center gap-1.5">
                          <i className="bi bi-clock" aria-hidden="true" />
                          {main.duration} {t('common.nights') || 'nights'}
                        </span>
                      )}
                      {main.price && (
                        <span className="text-copper font-bold text-lg">{formatPrice(main.price)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              </Reveal>
            )}

            {/* Floating mini cards for 2nd & 3rd destinations */}
            {second && third && (
              <div className="absolute -bottom-10 -start-4 lg:-start-8 lg:-bottom-16 grid gap-3 sm:grid-cols-2 z-20" role="list" aria-label={t('home.featuredDestinations') || 'Featured destinations'}>
                {[second, third].map((d, idx) => (
                  <Reveal key={d.id} delay={idx + 2} variant="image" className="group relative rounded-[1.5rem] overflow-hidden shadow-soft-lg ring-1 ring-white/5 hover:ring-copper/30 hover:-translate-y-1 transition-all duration-300" role="listitem">
                    <Link to={`/reselieuChoisi/${d.id}/`} className="block h-[180px] lg:h-[200px]" aria-label={`${t('cta.details')}: ${d.name}`}>
                      <img
                        src={mediaUrl(d.image)}
                        alt={d.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-darker/95 via-forest-darker/40 to-transparent" />
                      <div className="absolute bottom-4 start-4 end-4 text-sand-light">
                        <p className="text-xs font-bold uppercase tracking-wider text-copper/80">{d.city_name || t('home.hero2.featuredLocation')}</p>
                        <h4 className="font-display text-lg lg:text-xl leading-tight">{d.name}</h4>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------- Editorial Split ------------------------- */

function EditorialSplit({ t }) {
  return (
    <section className="relative overflow-hidden bg-forest-dark py-24 lg:py-32" aria-labelledby="editorial-title">
      <div className="pointer-events-none absolute inset-0 pattern-zellige opacity-[0.02]" aria-hidden="true" />
      <div className="container-site relative grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Left - text */}
        <div>
          <Reveal>
            <SectionTitle
              kicker={t('home.editorial.kicker') || 'PHILOSOPHY'}
              title={t('home.editorial.title1')}
              subtitle={t('home.editorial.title2')}
              align="start"
              dark
            />
          </Reveal>
          <Reveal delay={1} className="mt-8 max-w-lg">
            <p className="text-lg leading-relaxed text-sand-dark">{t('home.editorial.body')}</p>
          </Reveal>
          <Reveal delay={2} className="mt-10">
            <Link
              to="/about/"
              className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-copper hover:gap-3 transition-all"
            >
              {t('cta.details') || 'Learn more'}
              <i className="bi bi-arrow-right rtl:rotate-180" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>

        {/* Right - atmospheric image with floating elements */}
        <div className="relative">
          <Reveal variant="image" className="relative rounded-[2.5rem] overflow-hidden shadow-[0_60px_120px_-30px_rgb(var(--c-forest-darker)/0.7)] ring-1 ring-white/5">
            <img
              src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80"
              alt={t('home.editorial.imageAlt') || 'Saharan dunes at sunset'}
              className="w-full h-[520px] lg:h-[620px] object-cover transition-transform duration-1000 ease-expo hover:scale-[1.02]"
              loading="lazy"
            />
          </Reveal>

          {/* Floating stat chip */}
          <Reveal delay={2} className="absolute -bottom-6 -start-6 lg:-start-10 hidden lg:block glass-panel rounded-2xl px-6 py-4 border-white/10 shadow-soft">
            <div className="flex items-baseline gap-2">
              <div className="font-display text-4xl text-sand-light">03</div>
              <div className="text-sand-dark">
                <p className="text-xs uppercase tracking-wider">{t('home.editorial.statLabel') || 'EXPEDITIONS'}</p>
                <p className="font-semibold text-sand-light">{t('home.editorial.statValue') || 'Active Yearly'}</p>
              </div>
            </div>
          </Reveal>

          {/* Floating quote chip */}
          <Reveal delay={3} className="absolute -top-6 -end-6 hidden md:block glass-panel rounded-full px-5 py-3 border-white/10 shadow-soft items-center gap-2">
            <i className="bi bi-shield-check text-copper" aria-hidden="true" />
            <span className="text-xs font-semibold text-sand-light">{t('home.editorial.badge') || 'Trusted by 120k+'}</span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* -------------------------- Circuits ------------------------------- */

function Circuits({ t }) {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.packs().then(setPacks).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="circuits" className="py-24 bg-forest-darker/50">
        <div className="container-site flex justify-center py-16"><Spinner /></div>
      </section>
    );
  }
  if (!packs.length) return null;

  const [main, ...rest] = packs;
  const list = rest.slice(0, 3);

  return (
    <section id="circuits" className="relative overflow-hidden py-24 lg:py-32 bg-forest-darker" aria-labelledby="circuits-title">
      <div className="pointer-events-none absolute inset-0 pattern-zellige opacity-[0.02]" aria-hidden="true" />
      {/* Copper glow accent */}
      <div
        className="pointer-events-none absolute top-0 -end-20 w-[30rem] h-[30rem] opacity-[0.08] blur-[100px] rounded-full"
        style={{ background: 'rgb(var(--c-copper))' }}
        aria-hidden="true"
      />

      <div className="container-site relative">
        <Reveal>
          <SectionTitle
            kicker={t('home.circuits.kicker')}
            title={t('home.circuits.title')}
            subtitle={t('home.circuits.subtitle') || ''}
            align="start"
            dark
          />
        </Reveal>

        {/* Featured pack - full width cinematic card */}
        <Reveal delay={1} className="mt-14">
          <Link
            to={`/circuitChoisi/${main.id}/`}
            className="group relative grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden rounded-[2.5rem] bg-forest-dark shadow-[0_40px_80px_-20px_rgb(var(--c-forest-darker)/0.5)] ring-1 ring-white/5 hover:ring-copper/20 hover:-translate-y-1 transition-all duration-500"
            aria-label={`${t('cta.details')}: ${main.pack_name}`}
          >
            {/* Image side */}
            <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto min-h-[420px] overflow-hidden">
              <img
                src={mediaUrl(main.image || main.image_circuit)}
                alt={main.pack_name}
                className="w-full h-full object-cover transition-transform duration-1000 ease-expo group-hover:scale-105"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-forest-darker/90 via-forest-darker/30 to-transparent" />
              <div className="absolute bottom-6 start-6 end-6 text-sand-light">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  {main.date && (
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-copper/20 text-copper rounded-full backdrop-blur-sm">
                      {formatDate(main.date)}
                    </span>
                  )}
                  {main.duration && (
                    <span className="px-3 py-1 text-xs font-medium bg-white/10 text-sand-light rounded-full backdrop-blur-sm">
                      <i className="bi bi-clock mr-1" aria-hidden="true" />
                      {main.duration} {t('common.nights') || 'nights'}
                    </span>
                  )}
                </div>
                <h3 className="font-display text-3xl lg:text-4xl leading-tight">{main.pack_name}</h3>
              </div>
            </div>

            {/* Content side */}
            <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-center">
              <div className="text-copper text-sm font-bold uppercase tracking-wider mb-4">{t('home.circuits.featured') || 'Featured Expedition'}</div>
              <p className="text-sand-dark leading-relaxed mb-8 line-clamp-4">{main.description}</p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {main.price && (
                  <span className="font-display text-3xl text-copper">{formatPrice(main.price)}</span>
                )}
                <span className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-sand-light hover:text-copper transition-colors">
                  {t('cta.details')}
                  <i className="bi bi-arrow-right rtl:rotate-180 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </span>
              </div>
            </div>
          </Link>
        </Reveal>

        {/* Editorial list */}
        {list.length > 0 && (
          <Reveal delay={2} className="mt-16">
            <div className="divide-y divide-white/10 border-y border-white/10 rounded-2xl overflow-hidden">
              {list.map((pack, idx) => (
                <Reveal key={pack.id} delay={idx} className="group">
                  <Link
                    to={`/circuitChoisi/${pack.id}/`}
                    className="group flex flex-col md:flex-row md:items-center gap-6 py-7 hover:bg-white/[0.02] rounded-xl px-6 -mx-6 transition-colors"
                    aria-label={`${t('cta.details')}: ${pack.pack_name}`}
                  >
                    <span className="font-mono text-sm text-copper/60 w-10 text-center">{String(idx + 2).padStart(2, '0')}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display text-xl lg:text-2xl text-sand-light group-hover:text-copper transition-colors truncate">
                        {pack.pack_name}
                      </h4>
                      <p className="text-sm text-sand-dark mt-1.5 line-clamp-1">{pack.description}</p>
                    </div>
                    <div className="flex items-center gap-6 md:gap-10 text-sm flex-shrink-0">
                      {pack.date && <span className="text-sand-dark hidden sm:block">{formatDate(pack.date)}</span>}
                      {pack.price && <span className="text-copper font-semibold">{formatPrice(pack.price)}</span>}
                      {pack.duration && (
                        <span className="text-sand-dark hidden lg:inline-flex items-center gap-1">
                          <i className="bi bi-clock" aria-hidden="true" />
                          {pack.duration} {t('common.nights') || 'nights'}
                        </span>
                      )}
                      <span className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-copper group-hover:bg-copper group-hover:text-forest-darker group-hover:border-copper transition-all duration-300">
                        <i className="bi bi-arrow-right rtl:rotate-180" aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Reveal>
        )}

        <Reveal delay={3} className="mt-12 text-center">
          <Link
            to="/circuit/"
            className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-copper hover:gap-3 transition-all"
          >
            {t('home.circuits.viewAll')}
            <i className="bi bi-arrow-right rtl:rotate-180" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------- Pilgrimage ------------------------------ */

function Pilgrimage({ t }) {
  const features = [
    { icon: 'bi-buildings-fill', title: t('home.pilgrimage.feat1Title'), desc: t('home.pilgrimage.feat1Desc') },
    { icon: 'bi-people-fill', title: t('home.pilgrimage.feat2Title'), desc: t('home.pilgrimage.feat2Desc') },
    { icon: 'bi-shield-check', title: t('home.pilgrimage.feat3Title') || 'Visa & Logistics', desc: t('home.pilgrimage.feat3Desc') || 'Complete visa, flights and transfer management from Algeria.' },
  ];

  return (
    <section id="pilgrimage" className="relative overflow-hidden py-24 lg:py-32 bg-forest-dark" aria-labelledby="pilgrimage-title">
      <div className="pointer-events-none absolute inset-0 pattern-zellige opacity-[0.03]" aria-hidden="true" />
      <div
        className="pointer-events-none absolute top-1/2 -start-20 w-[40rem] h-[40rem] opacity-[0.1] blur-[120px] rounded-full -translate-y-1/2"
        style={{ background: 'rgb(var(--c-copper))' }}
        aria-hidden="true"
      />

      <div className="container-site relative grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Left - Image collage */}
        <div className="relative">
          <Reveal variant="image" className="relative rounded-[2.5rem] overflow-hidden shadow-[0_60px_120px_-30px_rgb(var(--c-forest-darker)/0.7)] ring-1 ring-white/5">
            <img
              src="https://images.unsplash.com/photo-1587428051510-6f73b6890d6e?auto=format&fit=crop&w=1200&q=80"
              alt={t('hadj.title')}
              className="w-full h-[520px] lg:h-[620px] object-cover transition-transform duration-1000 ease-expo hover:scale-[1.02]"
              loading="lazy"
            />
          </Reveal>

          <Reveal delay={2} className="absolute bottom-0 start-0 w-full lg:w-1/2 h-1/2 lg:h-2/3 min-h-[280px] rounded-[1.5rem] overflow-hidden shadow-soft-lg border-4 border-forest-darker ring-1 ring-white/5 z-10">
            <img
              src="https://images.unsplash.com/photo-1582946268181-f2b22c0a76cb?auto=format&fit=crop&w=800&q=80"
              alt={t('hadj.titleArabic')}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </Reveal>

          {/* Floating CTA chip */}
          <Reveal delay={3} className="absolute -top-4 -end-4 hidden lg:block glass-panel rounded-2xl px-5 py-3 border-white/10 shadow-soft items-center gap-2">
            <i className="bi bi-star-fill text-copper" aria-hidden="true" />
            <span className="text-xs font-semibold text-sand-light">{t('home.pilgrimage.badge') || '5★ Rated'}</span>
          </Reveal>
        </div>

        {/* Right - Text */}
        <div>
          <Reveal>
            <SectionTitle
              kicker={t('home.pilgrimage.kicker')}
              title={t('home.pilgrimage.title1')}
              subtitle={t('home.pilgrimage.title2')}
              align="start"
              dark
            />
          </Reveal>
          <Reveal delay={1} className="mt-8 max-w-lg">
            <p className="text-lg leading-relaxed text-sand-dark">{t('home.pilgrimage.body')}</p>
          </Reveal>

          <Reveal delay={2} className="mt-12 grid sm:grid-cols-2 gap-5">
            {features.map((f, idx) => (
              <div key={f.title} className="group relative p-6 rounded-2xl bg-forest-darker/50 border border-white/5 hover:border-copper/30 hover:bg-forest-darker/80 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-copper/15 text-copper flex items-center justify-center mb-4 group-hover:bg-copper group-hover:text-forest-darker transition-all duration-300">
                  <i className={`bi ${f.icon} text-xl`} aria-hidden="true"></i>
                </div>
                <h4 className="font-semibold text-sand-light mb-2">{f.title}</h4>
                <p className="text-sm text-sand-dark">{f.desc}</p>
              </div>
            ))}
          </Reveal>

          <Reveal delay={3} className="mt-10">
            <Link
              to="/hadj-omra/"
              className="btn bg-copper text-forest-darker px-10 py-5 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-copper-light hover:shadow-glow transition-all duration-300"
            >
              {t('home.pilgrimage.cta')}
              <i className="bi bi-arrow-right rtl:rotate-180 ml-2" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* -------------------------- Destinations ---------------------------- */

function Destinations({ t, destinations, loading }) {
  return (
    <section id="destinations" className="relative overflow-hidden py-24 lg:py-32 bg-forest-darker" aria-labelledby="destinations-title">
      <div className="pointer-events-none absolute inset-0 pattern-zellige opacity-[0.02]" aria-hidden="true" />
      <div className="container-site relative">
        <Reveal>
          <SectionTitle
            kicker={t('dest.kicker')}
            title={t('home.grid.title')}
            subtitle={t('home.grid.subtitle')}
            align="start"
            dark
          />
        </Reveal>

        <Reveal delay={1} className="mt-14">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="card h-80 animate-pulse bg-forest-dark border-white/5" />
                ))
              : destinations.map((d) => <DestinationCard key={d.id} destination={d} />)}
          </div>
        </Reveal>

        <Reveal delay={2} className="mt-12 text-center">
          <Link
            to="/destinations/"
            className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-copper hover:gap-3 transition-all"
          >
            {t('cta.seeMore')}
            <i className="bi bi-arrow-right rtl:rotate-180" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------------------- Weather ------------------------------ */

function WeatherSection({ t }) {
  return (
    <section id="weather" className="relative overflow-hidden py-24 lg:py-32 bg-forest-dark" aria-labelledby="weather-title">
      <div className="pointer-events-none absolute inset-0 pattern-zellige opacity-[0.04]" aria-hidden="true" />
      <div
        className="pointer-events-none absolute top-1/2 -end-20 w-[35rem] h-[35rem] opacity-[0.12] blur-[120px] rounded-full -translate-y-1/2"
        style={{ background: 'rgb(var(--c-copper))' }}
        aria-hidden="true"
      />

      <div className="container-site relative">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Reveal>
            <SectionTitle
              kicker={t('home.weather.kicker') || 'LIVE CONDITIONS'}
              title={t('home.weather.title')}
              subtitle={t('home.weather.subtitle')}
              align="center"
              dark
            />
          </Reveal>
        </div>
        <Reveal delay={1} className="max-w-2xl mx-auto">
          <WeatherWidget initialCity="El Bayadh" />
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------------------- Contact ------------------------------ */

function Contact({ t }) {
  const items = [
    { icon: 'bi-geo-alt', title: t('home.contactAddress'), body: 'El Bayadh, Algérie' },
    { icon: 'bi-envelope', title: t('home.contactEmail'), body: 'contact@elbayadhtravels.dz', href: 'mailto:contact@elbayadhtravels.dz' },
    { icon: 'bi-phone', title: t('home.contactPhone'), body: '+213 (0) 00 00 00 00' },
  ];

  return (
    <section id="contact" className="container-site py-20 relative" aria-labelledby="contact-title">
      <div className="pointer-events-none absolute top-0 -start-20 w-[30rem] h-[30rem] opacity-[0.05] blur-[100px] rounded-full" style={{ background: 'rgb(var(--c-copper))' }} aria-hidden="true" />
      <div className="text-center max-w-2xl mx-auto mb-14 relative z-10">
        <Reveal>
          <SectionTitle
            kicker={t('contact.kicker')}
            title={t('home.contact.title')}
            subtitle={t('home.contact.subtitle')}
            align="center"
            dark
          />
        </Reveal>
      </div>
      <Reveal delay={1} className="grid gap-6 md:grid-cols-3 relative z-10">
        {items.map((c) => (
          <div key={c.title} className="card p-8 text-center bg-forest-dark border-white/5 hover:border-copper/30 hover:bg-forest-darker/50 transition-all duration-300">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-copper/15 text-2xl text-copper">
              <i className={`bi ${c.icon}`} aria-hidden="true"></i>
            </div>
            <h4 className="mt-5 text-lg font-semibold text-sand-light">{c.title}</h4>
            <div className="mx-auto my-4 h-px w-12 bg-copper/30" />
            {c.href ? (
              <a href={c.href} className="text-sm text-sand-dark hover:text-copper transition-colors">{c.body}</a>
            ) : (
              <p className="text-sm text-sand-dark">{c.body}</p>
            )}
          </div>
        ))}
      </Reveal>
    </section>
  );
}

/* --------------------------- Composition --------------------------- */

function HomeV5() {
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
      <EditorialSplit t={t} />
      <Circuits t={t} />
      <Pilgrimage t={t} />
      <Destinations t={t} destinations={destinations} loading={loading} />
      <WeatherSection t={t} />
      <CtaBanner />
      <Contact t={t} />
    </>
  );
}

export default HomeV5;