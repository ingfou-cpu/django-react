import { useEffect, useState } from 'react';
import api from '../lib/api.js';
import PackCard from '../components/PackCard.jsx';
import { useLanguage } from '../lib/i18n.jsx';

export default function Croisiere() {
  const { t } = useLanguage();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.packs().then(setItems).finally(() => setLoading(false));
  }, []);

  return (
    <section className="container-site py-16">
      <div className="section-title">
        <h2>{t('croisiere.title')}</h2>
        <p>{t('croisiere.tagline')}</p>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card h-80 animate-pulse bg-forest-dark/10 dark:bg-white/5" />
            ))
          : items.map((p) => <PackCard key={p.id} pack={p} />)}
      </div>
      {!loading && !items.length && (
        <p className="mt-12 text-center text-forest-dark/60 dark:text-sand-dark">{t('croisiere.empty')}</p>
      )}
    </section>
  );
}
