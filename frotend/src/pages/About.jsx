import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../lib/i18n.jsx';

export default function About() {
  const { t } = useLanguage();
  const values = [
    { icon: 'bi-shield-check', title: t('about.value.reliability'), body: t('about.value.reliabilityBody') },
    { icon: 'bi-heart', title: t('about.value.passion'), body: t('about.value.passionBody') },
    { icon: 'bi-currency-exchange', title: t('about.value.transparency'), body: t('about.value.transparencyBody') },
    { icon: 'bi-globe2', title: t('about.value.security'), body: t('about.value.securityBody') },
  ];
  return (
    <section className="container-site py-16">
      <div className="mx-auto max-w-3xl text-center">
        <span className="badge border border-copper/40 bg-copper/10 text-copper">
          <i className="bi bi-compass"></i> {t('nav.about')}
        </span>
        <h1 className="mt-5 font-display text-4xl font-semibold leading-tight text-forest-dark sm:text-5xl dark:text-sand-light">
          El Bayadh <span className="text-copper">Travels</span>
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-forest-dark/70 dark:text-sand-dark">
          {t('about.intro')}
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {values.map((v) => (
          <div key={v.title} className="card p-7 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-copper/10 text-2xl text-copper">
              <i className={`bi ${v.icon}`}></i>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-forest-dark dark:text-sand-light">{v.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-forest-dark/60 dark:text-sand-dark">{v.body}</p>
          </div>
        ))}
      </div>

      <div className="card mt-14 grid gap-8 p-8 lg:grid-cols-2 lg:p-12">
        <div>
          <h2 className="text-2xl font-semibold text-forest-dark dark:text-sand-light">{t('about.mission')}</h2>
          <p className="mt-4 leading-relaxed text-forest-dark/70 dark:text-sand-dark">
            {t('about.missionBody')}
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-forest-dark dark:text-sand-light">{t('about.whyUs')}</h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-forest-dark/70 dark:text-sand-dark">
            {[
              t('about.whyUs.1'),
              t('about.whyUs.2'),
              t('about.whyUs.3'),
              t('about.whyUs.4'),
            ].map((item) => (
              <li key={item}>
                <i className="bi bi-check-circle-fill text-copper"></i> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-14 text-center">
        <Link to="/destinations" className="btn-primary">
          {t('cta.seeMore')} <i className="bi bi-arrow-right"></i>
        </Link>
      </div>
    </section>
  );
}
