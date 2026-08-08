import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api.js';
import { mediaUrl, truncate } from '../lib/format.jsx';
import { useLanguage } from '../lib/i18n.jsx';
import DestinationCard from '../components/DestinationCard.jsx';
import WeatherWidget from '../components/WeatherWidget.jsx';
import Spinner from '../components/Spinner.jsx';

function Hero({ t }) {
  return (
    <section className="relative overflow-hidden bg-forest-darker">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(201,123,58,0.18),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(46,103,88,0.35),transparent_45%)]" />
      <div className="container-site relative grid items-center gap-12 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:py-28">
        <div>
          <span className="badge border border-copper/40 bg-copper/10 text-copper-light">
            <span className="h-1.5 w-1.5 rounded-full bg-copper-light" /> {t('home.hero.welcome')}
          </span>
          <h1 className="mt-5 font-display text-5xl font-semibold leading-tight text-sand-light sm:text-6xl">
            El Bayadh <span className="text-copper-light">Travels</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-sand-dark">
            {t('home.hero.tagline')}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#destinations" className="btn-primary">
              <span>{t('home.hero.ctaDestinations')}</span>
              <i className="bi bi-arrow-right"></i>
            </a>
            <Link to="/circuit/" className="btn-ghost !text-sand-light !hover:bg-white/10">
              <i className="bi bi-map"></i> {t('home.hero.ctaCircuits')}
            </Link>
          </div>
          <dl className="mt-12 grid max-w-md grid-cols-3 divide-x divide-white/10 text-center">
            <div className="px-4">
              <dt className="font-display text-3xl font-semibold text-copper-light">50+</dt>
              <dd className="mt-1 text-xs uppercase tracking-wide text-sand-dark">{t('nav.destinations')}</dd>
            </div>
            <div className="px-4">
              <dt className="font-display text-3xl font-semibold text-copper-light">1000+</dt>
              <dd className="mt-1 text-xs uppercase tracking-wide text-sand-dark">{t('home.statTravelers')}</dd>
            </div>
            <div className="px-4">
              <dt className="font-display text-3xl font-semibold text-copper-light">15+</dt>
              <dd className="mt-1 text-xs uppercase tracking-wide text-sand-dark">{t('nav.circuits')}</dd>
            </div>
          </dl>
        </div>
        <div className="hidden justify-center lg:flex">
          <div className="relative w-full max-w-sm rounded-t-full border border-copper/30 bg-forest-dark p-3 shadow-soft">
            <div className="flex flex-col items-center rounded-t-full bg-gradient-to-b from-forest-dark to-forest-darker px-8 py-14 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-copper-gradient text-2xl text-white shadow-glow">
                <i className="bi bi-sun"></i>
              </div>
              <h4 className="mt-4 font-display text-xl text-sand-light">{t('home.hero.sahara')}</h4>
              <p className="mt-2 text-sm text-sand-dark">
                {t('home.hero.saharaDesc')}
              </p>
              <ul className="mt-6 space-y-3 text-sm text-sand-light">
                {[t('home.hero.featGuided'), t('home.hero.featNomad'), t('home.hero.featTransport')].map((f) => (
                  <li key={f}>
                    <i className="bi bi-check-circle-fill text-copper-light"></i> {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Carousel({ destinations }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % destinations.length), 3500);
    return () => clearInterval(id);
  }, [destinations.length]);
  if (!destinations.length) return null;
  const d = destinations[index];
  return (
    <div className="relative overflow-hidden rounded-3xl shadow-soft">
      <Link to={`/reselieuChoisi/${d.id}/`} className="relative block h-[22rem] sm:h-[26rem]">
        <img src={mediaUrl(d.image)} alt={d.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-darker/90 via-forest-darker/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
          <h5 className="font-display text-2xl font-semibold text-sand-light">{d.name}</h5>
          <p className="mt-1 line-clamp-2 max-w-2xl text-sm text-sand-dark">{d.description}</p>
        </div>
      </Link>
      <div className="absolute bottom-6 right-6 flex gap-2">
        {destinations.map((_, i) => (
          <button
            key={i}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all ${i === index ? 'w-6 bg-copper' : 'w-2 bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  );
}

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
      <Hero t={t} />

      {/* Carousel */}
      <section className="container-site py-16">
        <div className="section-title">
          <h2>{t('home.carousel.title')}</h2>
          <p>{t('home.carousel.subtitle')}</p>
        </div>
        <div className="mt-10">
          {loading ? (
            <div className="flex justify-center py-16"><Spinner /></div>
          ) : (
            <Carousel destinations={destinations} />
          )}
        </div>
      </section>

      {/* Destinations grid */}
      <section id="destinations" className="bg-forest-dark/5 py-20 dark:bg-white/[0.02]">
        <div className="container-site">
          <div className="section-title">
            <h2>{t('home.grid.title')}</h2>
            <p>{t('home.grid.subtitle')}</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="card h-80 animate-pulse bg-forest-dark/10 dark:bg-white/5" />
                ))
              : destinations.map((d) => <DestinationCard key={d.id} destination={d} />)}
          </div>
        </div>
      </section>

      {/* Weather */}
      <section id="weather" className="relative overflow-hidden bg-forest-darker py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(201,123,58,0.06),transparent_60%)]" />
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
