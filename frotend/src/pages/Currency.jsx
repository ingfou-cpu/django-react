import React, { useEffect, useMemo, useState } from 'react';
import Spinner from '../components/Spinner.jsx';
import { useLanguage } from '../lib/i18n.jsx';

const CURRENCIES = ['EUR', 'USD', 'DZD', 'GBP', 'CHF', 'MAD', 'TND', 'CNY', 'JPY', 'CAD'];
const RATES_URL = '/api/rates/';

export default function Currency() {
  const { t } = useLanguage();
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [amount, setAmount] = useState('100');
  const [from, setFrom] = useState('EUR');
  const [to, setTo] = useState('DZD');

  useEffect(() => {
    fetch(`${RATES_URL}?from=EUR`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.success || !data.rates) throw new Error(data.error || t('currency.ratesUnavailable'));
        setRates({ EUR: 1, ...data.rates });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const result = useMemo(() => {
    if (!rates) return null;
    const base = Number(rates[from]);
    const target = Number(rates[to]);
    if (!base || !target) return null;
    return (Number(amount || 0) / base) * target;
  }, [rates, amount, from, to]);

  const fmt = (v) =>
    new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(v ?? 0);

  return (
    <section className="container-site py-16">
      <div className="section-title">
        <h2>{t('currency.title')}</h2>
        <p>{t('currency.subtitle')}</p>
      </div>

      <div className="mx-auto mt-12 max-w-2xl">
        <div className="card p-8">
          {loading ? (
            <div className="flex justify-center py-10"><Spinner /></div>
          ) : error ? (
            <p className="text-center text-sm text-red-500">{error}</p>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-[1fr_auto_1fr]">
                <div>
                  <label className="label" htmlFor="cur-amount">{t('currency.amount')}</label>
                  <input
                    id="cur-amount"
                    type="number"
                    min="0"
                    step="any"
                    className="input"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label" htmlFor="cur-from">{t('currency.from')}</label>
                  <select id="cur-from" className="input" value={from} onChange={(e) => setFrom(e.target.value)}>
                    {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label" htmlFor="cur-to">{t('currency.to')}</label>
                  <select id="cur-to" className="input" value={to} onChange={(e) => setTo(e.target.value)}>
                    {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between rounded-2xl bg-copper/10 px-6 py-5">
                <span className="text-sm font-medium text-forest-dark/70 dark:text-sand-dark">
                  {fmt(amount)} {from} =
                </span>
                <span className="font-display text-2xl font-semibold text-copper">
                  {fmt(result)} {to}
                </span>
              </div>
              <p className="mt-3 text-center text-xs text-forest-dark/50 dark:text-sand-dark">
                {t('currency.rate')} 1 {from} = {fmt((Number(rates[to]) || 0) / (Number(rates[from]) || 1))} {to}
              </p>
            </>
          )}
        </div>

        <div className="card mt-8 overflow-hidden">
          <p className="border-b border-forest-dark/5 px-6 py-4 font-semibold text-forest-dark dark:border-white/5 dark:text-sand-light">
            {t('currency.baseRate')}
          </p>
          <div className="grid grid-cols-2 divide-x divide-y divide-forest-dark/5 sm:grid-cols-3 dark:divide-white/5">
            {rates &&
              CURRENCIES.filter((c) => c !== 'EUR').map((c) => (
                <div key={c} className="flex items-center justify-between px-6 py-3 text-sm">
                  <span className="font-medium text-forest-dark dark:text-sand-light">{c}</span>
                  <span className="text-forest-dark/60 dark:text-sand-dark">{fmt(rates[c])}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
