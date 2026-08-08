import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../lib/i18n.jsx';

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <section className="container-site flex flex-col items-center py-28 text-center">
      <p className="font-display text-[8rem] font-bold leading-none text-copper/20">404</p>
      <h1 className="mt-2 text-3xl font-semibold text-forest-dark dark:text-sand-light">{t('404.title')}</h1>
      <p className="mt-3 max-w-md text-forest-dark/60 dark:text-sand-dark">
        {t('404.message')}
      </p>
      <Link to="/" className="btn-primary mt-8">
        <i className="bi bi-house-door"></i> {t('common.backHome')}
      </Link>
    </section>
  );
}
