import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../lib/api.js';
import { formatPrice, formatDate } from '../lib/format.jsx';
import Spinner from '../components/Spinner.jsx';
import { useLanguage } from '../lib/i18n.jsx';

export default function PaymentSuccess() {
  const { t } = useLanguage();
  const [params] = useSearchParams();
  const sessionId = params.get('session_id') || '';
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }
    api
      .paymentRecords()
      .then((ps) => setRecord(ps.find((p) => p.stripe_checkout_session_id === sessionId) || null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sessionId]);

  return (
    <section className="container-site py-20">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/15 text-4xl text-green-500">
          <i className="bi bi-check-lg"></i>
        </div>
        <h1 className="mt-6 font-display text-3xl font-semibold text-forest-dark dark:text-sand-light">
          {t('payment.successTitle')}
        </h1>
        <p className="mt-3 text-forest-dark/60 dark:text-sand-dark">
          {t('payment.successMsg')}
        </p>

        {loading ? (
          <div className="mt-8 flex justify-center"><Spinner /></div>
        ) : record ? (
          <div className="card mt-8 space-y-3 p-6 text-left">
            <div className="flex justify-between text-sm">
              <span className="text-forest-dark/60 dark:text-sand-dark">{t('common.amount')}</span>
              <span className="font-semibold text-forest-dark dark:text-sand-light">{formatPrice(record.amount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-forest-dark/60 dark:text-sand-dark">{t('common.customer')}</span>
              <span className="font-semibold text-forest-dark dark:text-sand-light">{record.customer_name || '—'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-forest-dark/60 dark:text-sand-dark">{t('common.status')}</span>
              <span className="rounded-full bg-green-500/15 px-3 py-0.5 text-xs font-medium text-green-600 dark:text-green-300">
                {record.status}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-forest-dark/60 dark:text-sand-dark">{t('common.date')}</span>
              <span className="font-semibold text-forest-dark dark:text-sand-light">{formatDate(record.created_at)}</span>
            </div>
          </div>
        ) : (
          <p className="mt-8 text-sm text-forest-dark/50 dark:text-sand-dark">
            {t('common.session')} : {sessionId || t('payment.noSession')}
          </p>
        )}

        <div className="mt-10 flex justify-center gap-3">
          <Link to="/" className="btn-primary">{t('common.backHome')}</Link>
          <Link to="/payment/" className="btn-outline">{t('payment.anotherPayment')}</Link>
        </div>
      </div>
    </section>
  );
}
