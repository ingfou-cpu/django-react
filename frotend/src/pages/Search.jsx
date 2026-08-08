import React, { useEffect, useMemo, useState } from 'react';
import api from '../lib/api.js';
import DestinationCard from '../components/DestinationCard.jsx';
import PackCard from '../components/PackCard.jsx';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../lib/i18n.jsx';

export default function Search() {
  const { t } = useLanguage();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const [destinations, setDestinations] = useState([]);
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState(q);

  useEffect(() => {
    Promise.all([api.destinations(), api.packs()])
      .then(([ds, ps]) => {
        setDestinations(ds);
        setPacks(ps);
      })
      .finally(() => setLoading(false));
  }, []);

  const normalized = (s) => (s || '').toLowerCase().trim();
  const matches = (obj, keys) => {
    if (!q) return true;
    return keys.some((k) => normalized(obj[k]).includes(normalized(q)));
  };

  const foundDests = useMemo(
    () => destinations.filter((d) => matches(d, ['name', 'city_name', 'description'])),
    [destinations, q]
  );
  const foundPacks = useMemo(
    () => packs.filter((p) => matches(p, ['pack_name', 'description', 'itinerary'])),
    [packs, q]
  );

  const doSearch = (e) => {
    e.preventDefault();
    setParams(text.trim() ? { q: text.trim() } : {});
  };

  return (
    <section className="container-site py-16">
      <div className="section-title">
        <h2>{t('nav.search')}</h2>
        <p>{t('search.subtitle')}</p>
      </div>

      <form onSubmit={doSearch} className="mx-auto mt-10 flex max-w-xl gap-0 overflow-hidden rounded-full border border-forest-dark/15 bg-white p-1.5 focus-within:border-copper dark:border-white/10 dark:bg-white/5">
        <input
          type="search"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('search.placeholder')}
          className="flex-1 bg-transparent px-5 py-2.5 text-sm text-forest-dark outline-none placeholder-forest-dark/40 dark:text-sand-light dark:placeholder-sand-dark/50"
        />
        <button type="submit" className="btn-primary !py-2.5">
          <i className="bi bi-search"></i> {t('common.search')}
        </button>
      </form>

      {loading ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card h-80 animate-pulse bg-forest-dark/10 dark:bg-white/5" />
          ))}
        </div>
      ) : (
        <>
          {q && (
            <p className="mt-10 text-center text-sm text-forest-dark/60 dark:text-sand-dark">
              {t('search.resultsCount')
                .replace('{count}', String(foundDests.length + foundPacks.length))
                .replace('{q}', q)}
            </p>
          )}

          {foundDests.length > 0 && (
            <>
              <h2 className="section-title mt-12">
                <span className="text-xl font-semibold text-forest-dark dark:text-sand-light">{t('nav.destinations')}</span>
              </h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {foundDests.map((d) => <DestinationCard key={d.id} destination={d} />)}
              </div>
            </>
          )}

          {foundPacks.length > 0 && (
            <>
              <h2 className="section-title mt-12">
                <span className="text-xl font-semibold text-forest-dark dark:text-sand-light">{t('search.packsTitle')}</span>
              </h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {foundPacks.map((p) => <PackCard key={p.id} pack={p} />)}
              </div>
            </>
          )}

          {!foundDests.length && !foundPacks.length && (
            <p className="mt-14 text-center text-forest-dark/60 dark:text-sand-dark">
              {t('search.noResults')}
            </p>
          )}
        </>
      )}
    </section>
  );
}
