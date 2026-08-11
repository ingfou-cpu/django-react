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
/*  Hero — asymmetric split                                             */
/* ------------------------------------------------------------------ */

function Hero({ t, destinations }) {
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    if (destinations.length < 2) return;
    const id = setInterval(() => setImgIdx((i) => (i + 1) % destinations.length), 5000);
    return () => clearInterval(id);
  }, [destinations.length]);

  const d = destinations[imgIdx];

  return (
    <section className="relative min-h-[100dvh] pt-20 flex flex-col lg:flex-row items-center max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 gap-8 lg:gap-16">
      {/* Left content */}
      <div className="w-full lg:w-5/12 flex flex-col justify-center pt-12 lg:pt-0 z-10 order-2 lg:order-1">
        <Reveal>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-terracotta" />
            <span className="text-xs font-medium uppercase tracking-widest text-terracotta">{t('home.hero2.kicker')}</span>
          </div>
        </Reveal>

        <Reveal delay={1}>
          <h1 className="font-display display-text text-forest-dark dark:text-sand-light mb-6">
            Silence <br />
            <span className="text-forest-dark/30 dark:text-sand-dark/60 italic font-light">&amp;</span> Sand.
          </h1>
        </Reveal>

        <Reveal delay={2}>
          <p className="text-forest-dark/70 dark:text-sand-dark text-lg md:text-xl max-w-md leading-relaxed mb-10">
            {t('home.hero2.tagline')}
          </p>
        </Reveal>

        <Reveal delay={3}>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#destinations" className="group flex items-center justify-between border border-forest-dark/15 dark:border-white/20 rounded-full px-6 py-4 hover:border-terracotta transition-colors w-full sm:w-auto">
              <span className="text-sm font-medium uppercase tracking-wide mr-8 text-forest-dark dark:text-sand-light">{t('home.hero2.cta')}</span>
              <div className="w-8 h-8 rounded-full bg-sand-light dark:bg-white/10 flex items-center justify-center group-hover:bg-terracotta group-hover:text-white transition-colors">
                <i className="bi bi-arrow-down-right text-sm"></i>
              </div>
            </a>
            <Link to="/circuit/" className="btn-ghost !text-forest-dark dark:!text-sand-light !hover:bg-forest-dark/5 dark:!hover:bg-white/10 items-center gap-2">
              <i className="bi bi-map"></i> {t('home.hero.ctaCircuits')}
            </Link>
          </div>
        </Reveal>

        <Reveal delay={3}>
          <div className="mt-16 pt-8 border-t border-forest-dark/10 dark:border-white/10 grid grid-cols-2 gap-8">
            <div>
              <div className="font-display text-3xl text-forest-dark dark:text-sand-light mb-1">15+</div>
              <div className="text-xs uppercase tracking-wider text-forest-dark/50 dark:text-sand-dark">{t('home.hero2.yearsLabel')}</div>
            </div>
            <div>
              <div className="font-display text-3xl text-forest-dark dark:text-sand-light mb-1">4.9</div>
              <div className="text-xs uppercase tracking-wider text-forest-dark/50 dark:text-sand-dark">{t('home.hero2.ratingLabel')}</div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Right image canvas */}
      <div className="w-full lg:w-7/12 h-[55vh] lg:h-[82vh] relative order-1 lg:order-2 mt-8 lg:mt-0">
        <div className="absolute inset-0 bg-sand-dark/30 dark:bg-white/5 rounded-[2rem] overflow-hidden">
          {d ? (
            <Link to={`/reselieuChoisi/${d.id}/`} className="block h-full">
              <img
                src={mediaUrl(d.image)}
                alt={d.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-expo hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

              {/* Floating info card */}
              <div className="absolute bottom-6 left-6 right-6 lg:bottom-8 lg:left-8 lg:right-auto glass-panel p-6 rounded-2xl max-w-xs">
                <div className="flex items-center gap-2 mb-2 text-terracotta">
                  <i className="bi bi-geo-alt-fill text-sm"></i>
                  <span className="text-xs font-bold uppercase tracking-wider">{d.city_name || t('home.hero2.featuredLocation')}</span>
                </div>
                <h3 className="font-display text-xl text-forest-dark dark:text-sand-light mb-1">{d.name}</h3>
                <p className="text-sm text-forest-dark/60 dark:text-sand-dark line-clamp-2">
                  {d.description || t('home.hero2.featuredDesc')}
                </p>
              </div>
            </Link>
          ) : (
            <div className="w-full h-full bg-forest-dark/5 dark:bg-white/5 animate-pulse rounded-[2rem]" />
          )}

          {/* Image pagination dots */}
          {destinations.length > 1 && (
            <div className="absolute bottom-6 right-6 lg:bottom-8 lg:right-8 flex gap-2">
              {destinations.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => setImgIdx(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${i === imgIdx ? 'w-6 bg-white' : 'w-2 bg-white/40'}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Editorial Break                                                     */
/* ------------------------------------------------------------------ */

function EditorialBreak({ t }) {
  return (
    <section className="py-28 md:py-40 bg-white dark:bg-forest-darker relative">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <Reveal>
          <div className="mx-auto mb-8 w-12 h-12 rounded-full border border-terracotta/30 flex items-center justify-center">
            <i className="bi bi-star-fill text-terracotta text-lg"></i>
          </div>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl text-forest-dark dark:text-sand-light leading-tight mb-8">
            {t('home.editorial.title1')} <br />
            <span className="text-forest-dark/30 dark:text-sand-dark/60 italic font-light">{t('home.editorial.title2')}</span>
          </h2>
        </Reveal>
        <Reveal delay={2}>
          <p className="text-forest-dark/50 dark:text-sand-dark text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            {t('home.editorial.body')}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Curated Circuits — bento grid                                       */
/* ------------------------------------------------------------------ */

function CuratedCircuits({ t }) {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.packs().then(setPacks).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-sand-light/50 dark:bg-white/[0.02]">
        <div className="container-site flex justify-center py-16"><Spinner /></div>
      </section>
    );
  }
  if (!packs.length) return null;

  const [main, ...rest] = packs;
  const side = rest.slice(0, 2);

  return (
    <section id="circuits" className="py-24 bg-sand-light/50 dark:bg-white/[0.02]">
      <div className="container-site">
        {/* Header row */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-terracotta text-xs font-bold uppercase tracking-widest block mb-3">{t('home.circuits.kicker')}</span>
              <h2 className="font-display text-4xl md:text-5xl text-forest-dark dark:text-sand-light">{t('home.circuits.title')}</h2>
            </div>
            <Link to="/circuit/" className="group flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-forest-dark dark:text-sand-light hover:text-terracotta transition-colors">
              {t('home.circuits.viewAll')}
              <i className="bi bi-arrow-right group-hover:translate-x-1 transition-transform"></i>
            </Link>
          </div>
        </Reveal>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {/* Main large card */}
          <Reveal className="md:col-span-7">
            <Link
              to={`/circuitChoisi/${main.id}/`}
              className="group block relative overflow-hidden rounded-3xl bg-white dark:bg-forest-dark shadow-card ring-1 ring-forest-dark/5 dark:ring-white/5 transition hover:-translate-y-1.5 hover:shadow-soft"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={mediaUrl(main.image || main.image_circuit)}
                  alt={main.pack_name}
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6 md:p-8">
                {main.date && (
                  <div className="text-forest-dark/50 dark:text-sand-dark text-sm mb-2 font-medium">{formatDate(main.date)}</div>
                )}
                <h3 className="font-display text-2xl md:text-3xl text-forest-dark dark:text-sand-light group-hover:text-terracotta transition-colors">{main.pack_name}</h3>
                {main.price && (
                  <div className="mt-3 text-copper font-semibold">{formatPrice(main.price)}</div>
                )}
              </div>
            </Link>
          </Reveal>

          {/* Side column — smaller cards */}
          <div className="md:col-span-5 flex flex-col gap-6 md:gap-8 md:pt-16">
            {side.map((pack, idx) => (
              <Reveal key={pack.id} delay={idx + 1}>
                <Link
                  to={`/circuitChoisi/${pack.id}/`}
                  className="group block overflow-hidden rounded-2xl bg-white dark:bg-forest-dark shadow-card ring-1 ring-forest-dark/5 dark:ring-white/5 transition hover:-translate-y-1"
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
                  <div className="p-5">
                    <h3 className="font-display text-xl text-forest-dark dark:text-sand-light group-hover:text-terracotta transition-colors mb-1">{pack.pack_name}</h3>
                    <p className="text-sm text-forest-dark/60 dark:text-sand-dark line-clamp-2">{pack.description}</p>
                  </div>
                </Link>
              </Reveal>
            ))}

            {/* Fallback if only 1 pack total */}
            {side.length === 0 && (
              <div className="rounded-2xl border-2 border-dashed border-forest-dark/10 dark:border-white/10 p-8 text-center text-forest-dark/40 dark:text-sand-dark/60 text-sm">
                {t('circuit.list.empty')}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Destinations Grid                                                   */
/* ------------------------------------------------------------------ */

function DestinationsGrid({ t, destinations, loading }) {
  return (
    <section id="destinations" className="py-20">
      <div className="container-site">
        <Reveal>
          <div className="section-title">
            <h2>{t('home.grid.title')}</h2>
            <p>{t('home.grid.subtitle')}</p>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

/* ------------------------------------------------------------------ */
/*  Pilgrimage — dark section                                           */
/* ------------------------------------------------------------------ */

function PilgrimageSection({ t }) {
  const features = [
    { title: t('home.pilgrimage.feat1Title'), desc: t('home.pilgrimage.feat1Desc') },
    { title: t('home.pilgrimage.feat2Title'), desc: t('home.pilgrimage.feat2Desc') },
  ];

  return (
    <section id="pilgrimage" className="py-28 md:py-36 bg-forest-darker text-sand-light relative overflow-hidden">
      {/* Abstract background blurs */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-terracotta/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] bg-white/3 rounded-full blur-[80px] pointer-events-none" />
      <div className="pointer-events-none absolute inset-0 pattern-star opacity-30" />

      <div className="container-site relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text content */}
          <div className="order-2 lg:order-1">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/20 rounded-full text-xs font-medium tracking-widest uppercase mb-8">
                <i className="bi bi-moon-stars-fill text-terracotta"></i>
                {t('home.pilgrimage.kicker')}
              </div>
            </Reveal>
            <Reveal delay={1}>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight mb-8">
                {t('home.pilgrimage.title1')} <br />
                <span className="text-sand-dark italic font-light">{t('home.pilgrimage.title2')}</span>
              </h2>
            </Reveal>
            <Reveal delay={2}>
              <p className="text-sand-dark text-lg mb-10 max-w-md font-light leading-relaxed">
                {t('home.pilgrimage.body')}
              </p>
            </Reveal>

            <Reveal delay={2}>
              <ul className="space-y-6 mb-12">
                {features.map((f) => (
                  <li key={f.title} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center shrink-0 mt-0.5">
                      <i className="bi bi-check text-xs text-terracotta"></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-white mb-1">{f.title}</h4>
                      <p className="text-sm text-sand-dark">{f.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={3}>
              <Link to="/hadj-omra/" className="btn bg-white text-forest-darker px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-terracotta hover:text-white transition-colors duration-300">
                {t('home.pilgrimage.cta')}
              </Link>
            </Reveal>
          </div>

          {/* Image collage */}
          <div className="order-1 lg:order-2 relative h-[50vh] lg:h-[72vh] w-full">
            <Reveal className="absolute top-0 right-0 w-3/4 h-3/4 rounded-3xl overflow-hidden shadow-2xl z-10">
              <img
                src="https://images.unsplash.com/photo-1565552643982-27ce6f4ed6f6?auto=format&fit=crop&w=800&q=80"
                alt="Islamic architecture"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Reveal>
            <Reveal delay={2} className="absolute bottom-0 left-0 w-2/3 h-1/2 rounded-3xl overflow-hidden shadow-2xl border-4 border-forest-darker z-20">
              <img
                src="https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&w=800&q=80"
                alt="Mosque silhouette at sunset"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Home — composition                                                  */
/* ------------------------------------------------------------------ */

function Home() {
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

      <EditorialBreak t={t} />

      <CuratedCircuits t={t} />

      <DestinationsGrid t={t} destinations={destinations} loading={loading} />

      <PilgrimageSection t={t} />

      {/* Weather */}
      <section id="weather" className="relative overflow-hidden bg-forest-darker py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgb(var(--c-copper)/0.06),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 pattern-zellige opacity-50" />
        <div className="container-site relative">
          <div className="section-title">
            <h2 className="!text-sand-light">{t('home.weather.title')}</h2>
            <p className="!text-sand-dark">{t('home.weather.subtitle')}</p>
          </div>
          <div className="mt-10">
            <WeatherWidget initialCity="El Bayadh" />
          </div>
        </div>
      </section>

      <CtaBanner />

      {/* Contact */}
      <section id="contact" className="container-site py-20">
        <div className="section-title">
          <h2>{t('home.contact.title')}</h2>
          <p>{t('home.contact.subtitle')}</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: 'bi-geo-alt', title: 'home.contactAddress', body: 'El Bayadh, Algérie' },
            { icon: 'bi-envelope', title: 'home.contactEmail', body: 'contact@elbayadhtravels.dz', href: 'mailto:contact@elbayadhtravels.dz' },
            { icon: 'bi-phone', title: 'home.contactPhone', body: '+213 (0) 00 00 00 00' },
          ].map((c) => (
            <div key={c.title} className="card p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-copper/10 text-2xl text-copper">
                <i className={`bi ${c.icon}`}></i>
              </div>
              <h4 className="mt-4 text-lg font-semibold text-forest-dark dark:text-sand-light">{t(c.title)}</h4>
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
    </>
  );
}

export default Home;
