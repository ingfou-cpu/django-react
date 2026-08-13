import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api.js';
import { mediaUrl, formatPrice } from '../lib/format.jsx';
import { useLanguage } from '../lib/i18n.jsx';
import Reveal from '../components/Reveal.jsx';
import WeatherWidget from '../components/WeatherWidget.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import Spinner from '../components/Spinner.jsx';

/* ------------------------------------------------------------------ */
/*  V4 — Horizons cinématiques                                         */
/*  Cinematic, data-driven. Ken-Burns hero on live destination images, */
/*  marquee ticker, count-up stats, interactive destination explorer,  */
/*  price-forward circuit cards, pilgrimage band, live weather.        */
/* ------------------------------------------------------------------ */

/* --------------------------- Count-up hook ------------------------- */

function useCountUp(target, decimals = 0) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf;
    let started = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          const start = performance.now();
          const duration = 1600;
          const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setValue(Number((target * eased).toFixed(decimals)));
            if (p < 1) raf = requestAnimationFrame(tick);
            else setValue(target);
          };
          raf = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [target, decimals]);

  return [ref, value];
}

/* ------------------------- Hero + quick search --------------------- */

function Hero({ t, destinations, loading }) {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [offset, setOffset] = useState(0);

  const images = useMemo(
    () =>
      (destinations || [])
        .filter((d) => d.image)
        .slice(0, 5)
        .map((d) => ({ url: mediaUrl(d.image), name: d.name, city: d.city_name })),
    [destinations],
  );
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % images.length), 6000);
    return () => clearInterval(id);
  }, [images.length]);

  useEffect(() => {
    let raf;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setOffset(window.scrollY);
        raf = null;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const submit = (e) => {
    e.preventDefault();
    navigate(q.trim() ? `/search/?q=${encodeURIComponent(q.trim())}` : '/search/');
  };

  return (
    <section className="relative flex min-h-[94vh] flex-col justify-end overflow-hidden bg-forest-darker text-sand-light">
      {/* Parallax backdrop layer */}
      <div
        className="absolute inset-0 -bottom-32"
        style={{ transform: `translateY(${Math.min(offset, 600) * 0.35}px)` }}
      >
        {images.length > 0 ? (
          images.map((img, i) => (
            <img
              key={`${img.url}-${i}`}
              src={img.url}
              alt={img.name}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ${
                i === slide ? 'kenburns opacity-100' : 'opacity-0'
              }`}
            />
          ))
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgb(var(--c-copper)/0.35),rgb(var(--c-forest-darker))_60%)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-forest-darker via-forest-darker/55 to-forest-darker/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-darker/70 via-transparent to-transparent" />
        <div className="pointer-events-none absolute inset-0 pattern-zellige opacity-40" />
      </div>

      {/* Content */}
      <div className="container-site relative z-10 pb-20 pt-36">
        <Reveal>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-copper/40 bg-white/5 backdrop-blur text-copper-light text-xs font-bold uppercase tracking-[0.22em] mb-8">
            <i className="bi bi-sunset-fill"></i> {t('home.hero2.kicker')}
          </div>
        </Reveal>

        <Reveal delay={1}>
          <h1 className="font-display display-text max-w-4xl text-sand-light">
            {t('home.editorial.title1')}{' '}
            <span className="text-copper italic font-light">{t('home.editorial.title2')}</span>
          </h1>
        </Reveal>

        <Reveal delay={2}>
          <p className="mt-7 max-w-xl text-lg text-sand-dark leading-relaxed">
            {t('home.hero2.tagline')}
          </p>
        </Reveal>

        <Reveal delay={3}>
          <form
            onSubmit={submit}
            className="mt-10 flex w-full max-w-2xl flex-col gap-2 rounded-full border border-white/15 bg-white/10 p-2 backdrop-blur-xl sm:flex-row sm:items-center"
          >
            <div className="flex flex-1 items-center gap-3 ps-3">
              <i className="bi bi-geo-alt text-copper-light"></i>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t('search.placeholder')}
                className="w-full bg-transparent py-2 text-sm text-sand-light placeholder-sand-dark outline-none"
              />
            </div>
            <button
              type="submit"
              className="btn-primary shrink-0 rounded-full px-7 py-3.5 text-sm font-bold uppercase tracking-wider"
            >
              <i className="bi bi-arrow-right me-2 rtl:rotate-180"></i>
              {t('common.search')}
            </button>
          </form>
        </Reveal>

        <Reveal delay={4}>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              to="/destinations/"
              className="btn-pill-outline px-8 py-4 text-sm font-bold uppercase tracking-wider"
            >
              {t('home.hero.ctaDestinations')}
            </Link>
            <Link
              to="/circuit/"
              className="px-8 py-4 text-sm font-bold uppercase tracking-wider text-sand-light/80 transition-colors hover:text-copper-light"
            >
              {t('home.hero.ctaCircuits')}
              <i className="bi bi-arrow-right ms-2 rtl:rotate-180"></i>
            </Link>
            {!loading && (
              <span className="ms-auto hidden items-center gap-2 text-xs font-medium uppercase tracking-widest text-sand-dark md:inline-flex">
                <i className="bi bi-geo-alt text-copper"></i>
                {images[slide] ? `${images[slide].city || images[slide].name}` : t('home.hero2.featuredLocation')}
              </span>
            )}
          </div>
        </Reveal>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-sand-dark">
        <i className="bi bi-chevron-down animate-bounce"></i>
      </div>
    </section>
  );
}

/* ----------------------------- Marquee ----------------------------- */

function Marquee({ destinations }) {
  const names = useMemo(() => {
    const list = (destinations || []).map((d) => d.name).filter(Boolean);
    if (list.length < 6) {
      list.push('El Bayadh', 'Djanet', 'Tassili n\u2019Ajjer', 'Timgad', 'Constantine', 'Oran');
    }
    return list;
  }, [destinations]);

  const Row = () => (
    <div className="flex shrink-0 items-center gap-10 pe-10">
      {names.map((name, i) => (
        <span key={`${name}-${i}`} className="flex items-center gap-10 whitespace-nowrap">
          <span className="font-display text-lg tracking-wide">{name}</span>
          <i className="bi bi-asterisk text-copper-light text-sm"></i>
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee relative overflow-hidden bg-terracotta py-4 text-white">
      <div className="marquee-track flex w-max items-center">
        <Row />
        <Row />
      </div>
    </div>
  );
}

/* --------------------------- Live stats ---------------------------- */

function Stats({ t }) {
  const [yearsRef, years] = useCountUp(15);
  const [travelersRef, travelers] = useCountUp(12500);
  const [ratingRef, rating] = useCountUp(4.9, 1);

  const items = [
    { ref: yearsRef, value: `${Math.round(years)}`, label: t('home.hero2.yearsLabel') },
    {
      ref: travelersRef,
      value: `${Math.round(travelers).toLocaleString('fr-FR')}+`,
      label: t('home.statTravelers'),
    },
    { ref: ratingRef, value: rating.toFixed(1), label: t('home.hero2.ratingLabel') },
  ];

  return (
    <section className="bg-forest-darker pb-16 pt-2 text-sand-light">
      <div className="container-site grid grid-cols-1 divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0 rtl:sm:divide-x-reverse">
        {items.map((item, idx) => (
          <div key={idx} ref={item.ref} className="px-6 py-8 text-center sm:py-4">
            <span className="font-display block text-4xl md:text-5xl text-copper-light tabular-nums">
              {item.value}
            </span>
            <span className="mt-2 block text-xs font-bold uppercase tracking-[0.2em] text-sand-dark">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ----------------------- Destination explorer ---------------------- */

function Explorer({ t, destinations, loading }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || destinations.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % destinations.length), 6000);
    return () => clearInterval(id);
  }, [paused, destinations.length]);

  const select = (i) => {
    setIndex(i);
    setPaused(true);
  };

  return (
    <section className="relative overflow-hidden bg-forest-darker py-24 text-sand-light">
      <div className="pointer-events-none absolute inset-0 pattern-zellige opacity-30" />
      <div className="container-site relative">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* List */}
          <div className="lg:col-span-5">
            <Reveal>
              <span className="text-terracotta text-xs font-bold uppercase tracking-widest block mb-3">
                {t('dest.kicker')}
              </span>
              <h2 className="font-display text-4xl md:text-5xl">{t('home.grid.title')}</h2>
              <p className="mt-3 text-sand-dark max-w-sm">{t('home.grid.subtitle')}</p>
            </Reveal>

            <div className="mt-10 space-y-2">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-16 animate-pulse rounded-2xl bg-white/5" />
                  ))
                : destinations.map((d, i) => {
                    const active = i === index;
                    return (
                      <button
                        key={d.id}
                        onMouseEnter={() => setPaused(true)}
                        onClick={() => select(i)}
                        className={`group flex w-full items-center justify-between gap-4 rounded-2xl px-5 py-4 text-start transition-colors duration-300 ${
                          active
                            ? 'bg-white/10 ring-1 ring-copper/40'
                            : 'hover:bg-white/5'
                        }`}
                      >
                        <span className="flex items-center gap-4">
                          <span
                            className={`w-2 h-2 shrink-0 rounded-full transition-colors ${
                              active ? 'bg-copper-light' : 'bg-white/20'
                            }`}
                          />
                          <span>
                            <span
                              className={`block font-display text-lg transition-colors ${
                                active ? 'text-copper-light' : 'text-sand-light/80 group-hover:text-sand-light'
                              }`}
                            >
                              {d.name}
                            </span>
                            <span className="block text-xs text-sand-dark">{d.city_name}</span>
                          </span>
                        </span>
                        <i
                          className={`bi bi-arrow-right rtl:rotate-180 text-copper transition-transform duration-300 ${
                            active ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
                          }`}
                        ></i>
                      </button>
                    );
                  })}
            </div>
          </div>

          {/* Featured panel */}
          <div className="lg:col-span-7">
            {loading ? (
              <div className="aspect-[4/3] animate-pulse rounded-3xl bg-white/5" />
            ) : destinations[index] ? (
              <Reveal key={destinations[index].id} variant="image">
                <Link
                  to={`/reselieuChoisi/${destinations[index].id}/`}
                  className="group relative block aspect-[4/3] overflow-hidden rounded-3xl shadow-soft-lg ring-1 ring-white/10"
                >
                  <img
                    src={mediaUrl(destinations[index].image)}
                    alt={destinations[index].name}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-7 md:p-9">
                    <span className="badge w-fit bg-white/15 backdrop-blur mb-3">
                      <i className="bi bi-geo-alt"></i>{' '}
                      {destinations[index].city_name || 'Algérie'}
                    </span>
                    <h3 className="font-display text-3xl md:text-4xl text-white">
                      {destinations[index].name}
                    </h3>
                    <p className="mt-2 max-w-lg text-sm text-white/80 line-clamp-2">
                      {destinations[index].description}
                    </p>
                    <div className="mt-5 flex items-center gap-5">
                      {destinations[index].price && (
                        <span className="text-copper-light font-semibold">
                          {t('common.from')} {formatPrice(destinations[index].price)}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-white/90 transition group-hover:gap-2">
                        {t('cta.details')} <i className="bi bi-arrow-right rtl:rotate-180"></i>
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ) : (
              <div className="aspect-[4/3] rounded-3xl bg-white/5" />
            )}

            {destinations.length > 1 && (
              <div className="mt-5 flex items-center gap-2">
                {destinations.map((d, i) => (
                  <button
                    key={d.id}
                    aria-label={d.name}
                    onClick={() => select(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === index ? 'w-8 bg-copper-light' : 'w-3 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------- Circuits — price-forward -------------------- */

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
              <span className="text-terracotta text-xs font-bold uppercase tracking-widest block mb-3">
                {t('home.circuits.kicker')}
              </span>
              <h2 className="font-display text-4xl md:text-5xl text-forest-dark dark:text-sand-light">
                {t('home.circuits.title')}
              </h2>
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
                    <span className="text-xs font-medium text-forest-dark/50 dark:text-sand-dark">
                      {t('circuit.featured')}
                    </span>
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
              {t('home.pilgrimage.title1')}{' '}
              <span className="text-copper italic font-light">{t('home.pilgrimage.title2')}</span>
            </h3>
            <p className="text-sand-dark text-base md:text-lg max-w-md mb-8 line-clamp-3">
              {t('home.pilgrimage.body')}
            </p>
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
          <span className="text-terracotta text-xs font-bold uppercase tracking-widest block mb-3">
            {t('contact.kicker')}
          </span>
          <h2 className="font-display text-4xl text-forest-dark dark:text-sand-light">
            {t('home.contact.title')}
          </h2>
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

function HomeV4() {
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
      <Hero t={t} destinations={destinations} loading={loading} />
      <Marquee destinations={destinations} />
      <Stats t={t} />
      <Explorer t={t} destinations={destinations} loading={loading} />
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

export default HomeV4;
