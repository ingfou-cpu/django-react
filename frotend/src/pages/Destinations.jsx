import { useEffect, useState } from 'react';
import api from '../lib/api.js';
import DestinationCard from '../components/DestinationCard.jsx';
import Spinner from '../components/Spinner.jsx';
import { useLanguage } from '../lib/i18n.jsx';

export default function Destinations() {
  const { t } = useLanguage();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.destinations().then(setItems).finally(() => setLoading(false));
  }, []);

  return (
    <section className="container-site py-16">
      <div className="section-title">
        <h2>{t('dest.title')}</h2>
        <p>{t('dest.subtitle')}</p>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card h-80 animate-pulse bg-forest-dark/10 dark:bg-white/5" />
            ))
          : items.map((d) => <DestinationCard key={d.id} destination={d} />)}
      </div>
      {!loading && !items.length && (
        <p className="mt-12 text-center text-forest-dark/60 dark:text-sand-dark">{t('dest.empty')}</p>
      )}
    </section>
  );
}
