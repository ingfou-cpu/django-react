import WeatherWidget from '../components/WeatherWidget.jsx';
import { useLanguage } from '../lib/i18n.jsx';

export default function Weather() {
  const { t } = useLanguage();
  return (
    <section className="container-site py-16">
      <div className="section-title">
        <h2>{t('nav.weather')}</h2>
        <p>{t('weather.subtitle')}</p>
      </div>
      <div className="mt-10">
        <WeatherWidget initialCity="El Bayadh" />
      </div>
    </section>
  );
}
