import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api.js';
import { mediaUrl, formatPrice } from '../lib/format.jsx';
import { getCookie } from '../lib/api.js';
import Spinner from '../components/Spinner.jsx';
import { useLanguage } from '../lib/i18n.jsx';

export default function PaymentHome() {
  const { t } = useLanguage();
  const [destinations, setDestinations] = useState([]);
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(null); // id du pack en cours
  const [form, setForm] = useState({ customer_name: '', customer_email: '', customer_phone: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.destinations(), api.packs()])
      .then(([ds, ps]) => {
        setDestinations(ds);
        setPacks(ps);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Le checkout est une vraie requête Django -> redirect Stripe ; on le fait
  // via un formulaire natif (même origine grâce au proxy Vite).
  const checkout = (url) => {
    const f = document.createElement('form');
    f.method = 'POST';
    f.action = url;
    const csrf = getCookie('csrftoken');
    if (csrf) {
      const t = document.createElement('input');
      t.type = 'hidden';
      t.name = 'csrfmiddlewaretoken';
      t.value = csrf;
      f.appendChild(t);
    }
    for (const [k, v] of Object.entries(form)) {
      const i = document.createElement('input');
      i.type = 'hidden';
      i.name = k;
      i.value = v;
      f.appendChild(i);
    }
    document.body.appendChild(f);
    f.submit();
  };

  const handleBuy = (e, kind, id, name) => {
    e.preventDefault();
    setBuying(id);
    checkout(kind === 'destination' ? `/payment/checkout/destination/${id}/` : `/payment/checkout/pack/${id}/`);
  };

  return (
    <section className="container-site py-16">
      <div className="section-title">
        <h2>{t('payment.title')}</h2>
        <p>{t('payment.subtitle')}</p>
      </div>

      <div className="card mx-auto mt-10 max-w-lg p-6">
        <h3 className="text-lg font-semibold text-forest-dark dark:text-sand-light">{t('payment.yourInfo')}</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="pay-name">{t('payment.fullName')}</label>
            <input id="pay-name" className="input" value={form.customer_name} onChange={(e) => setForm((f) => ({ ...f, customer_name: e.target.value }))} placeholder={t('payment.namePlaceholder')} />
          </div>
          <div>
            <label className="label" htmlFor="pay-phone">{t('payment.phone')}</label>
            <input id="pay-phone" className="input" value={form.customer_phone} onChange={(e) => setForm((f) => ({ ...f, customer_phone: e.target.value }))} placeholder="0555 12 34 56" />
          </div>
        </div>
        <div className="mt-4">
          <label className="label" htmlFor="pay-email">{t('payment.email')}</label>
          <input id="pay-email" type="email" className="input" value={form.customer_email} onChange={(e) => setForm((f) => ({ ...f, customer_email: e.target.value }))} placeholder="vous@exemple.com" />
        </div>
        <p className="mt-3 text-xs text-forest-dark/50 dark:text-sand-dark">
          <i className="bi bi-shield-lock me-1 text-copper"></i>
          {t('payment.secure')}
        </p>
      </div>

      {error && (
        <p className="mx-auto mt-6 max-w-lg rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-600 dark:text-red-300">{error}</p>
      )}

      {loading ? (
        <div className="mt-12 flex justify-center"><Spinner /></div>
      ) : (
        <>
          {destinations.length > 0 && (
            <>
              <h2 className="section-title mt-16">
                <span className="text-xl font-semibold text-forest-dark dark:text-sand-light">{t('nav.destinations')}</span>
              </h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {destinations.map((d) => (
                  <div key={d.id} className="card overflow-hidden">
                    <img src={mediaUrl(d.image)} alt={d.name} className="h-40 w-full object-cover" />
                    <div className="p-5">
                      <h4 className="font-semibold text-forest-dark dark:text-sand-light">{d.name}</h4>
                      <p className="mt-2 text-sm text-forest-dark/60 dark:text-sand-dark">{d.city_name}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="font-semibold text-copper">{formatPrice(d.price)}</span>
                        <button
                          disabled={buying === `d${d.id}`}
                          onClick={(e) => handleBuy(e, 'destination', d.id, d.name)}
                          className="btn-primary !px-5 !py-2 text-sm"
                        >
                          {buying === `d${d.id}` ? <Spinner className="!h-4 !w-4" /> : <><i className="bi bi-credit-card"></i> {t('payment.pay')}</>}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {packs.length > 0 && (
            <>
              <h2 className="section-title mt-16">
                <span className="text-xl font-semibold text-forest-dark dark:text-sand-light">{t('payment.packsTitle')}</span>
              </h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {packs.map((p) => (
                  <div key={p.id} className="card overflow-hidden">
                    <img src={mediaUrl(p.image || p.image_circuit)} alt={p.pack_name} className="h-40 w-full object-cover" />
                    <div className="p-5">
                      <h4 className="font-semibold text-forest-dark dark:text-sand-light">{p.pack_name}</h4>
                      <p className="mt-2 line-clamp-2 text-sm text-forest-dark/60 dark:text-sand-dark">{p.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="font-semibold text-copper">{formatPrice(p.price)}</span>
                        <button
                          disabled={buying === `p${p.id}`}
                          onClick={(e) => handleBuy(e, 'pack', p.id, p.pack_name)}
                          className="btn-primary !px-5 !py-2 text-sm"
                        >
                          {buying === `p${p.id}` ? <Spinner className="!h-4 !w-4" /> : <><i className="bi bi-credit-card"></i> {t('payment.pay')}</>}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      <p className="mt-14 text-center text-sm text-forest-dark/50 dark:text-sand-dark">
        {t('payment.alreadyPaid')}{' '}
        <Link to="/payment/success/" className="font-semibold text-copper">{t('payment.viewStatus')}</Link>
      </p>
    </section>
  );
}
