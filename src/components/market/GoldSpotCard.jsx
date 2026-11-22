import QuoteTimestamp from '@/components/market/QuoteTimestamp';
import TradingViewMiniChart from '@/components/market/TradingViewMiniChart';
import { useLanguage } from '@/lib/LanguageContext';

const copy = {
  en: { title: 'Gold', usd: 'USD per troy ounce', aed: 'AED per gram (24K)', unavailable: 'Gold spot price and AED conversion are unavailable in the app. Check the TradingView widget below for the USD quote.', loading: 'Loading gold price…', note: 'Spot price. Shop prices are higher because jewellery adds making charges.', disclaimer: 'For learning only. Not financial advice.', attribution: 'Gold quote and chart by' },
  ar: { title: 'الذهب', usd: 'دولار أمريكي لكل أونصة تروي', aed: 'درهم إماراتي لكل غرام (عيار 24)', unavailable: 'سعر الذهب الفوري والتحويل إلى الدرهم غير متاحين في التطبيق حاليًا. راجع أداة TradingView أدناه للاطلاع على السعر بالدولار الأمريكي.', loading: 'جارٍ تحميل سعر الذهب…', note: 'هذا هو السعر الفوري. أسعار المحلات أعلى لأن سعر المجوهرات يشمل رسوم المصنعية.', disclaimer: 'لأغراض تعليمية فقط. هذه ليست نصيحة مالية.', attribution: 'سعر الذهب والرسم البياني من' },
};

export default function GoldSpotCard({ market }) {
  const { lang } = useLanguage();
  const text = copy[lang] || copy.en;
  const quote = market.quotes['XAU/USD'];
  const price = quote?.price;
  const hasPrice = Number.isFinite(price) && price > 0 && !market.issues['XAU/USD'];
  const format = new Intl.NumberFormat(lang === 'ar' ? 'ar-AE' : 'en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <section dir={lang === 'ar' ? 'rtl' : 'ltr'} aria-labelledby="gold-spot-title">
      <h3 id="gold-spot-title" className="text-sm font-space font-bold mb-3">{text.title}</h3>
      <div className="glass-card p-4 space-y-3">
        {hasPrice ? (
          <>
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[[text.usd, price], [text.aed, price / 31.1035 * 3.6725]].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd className="text-lg font-space font-bold"><bdi>{format.format(value)}</bdi></dd>
                </div>
              ))}
            </dl>
            <QuoteTimestamp fetchedAt={quote.fetchedAt} />
          </>
        ) : market.isPending && !market.isError ? (
          <p role="status" className="text-sm text-muted-foreground">{text.loading}</p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">{text.unavailable}</p>
            <TradingViewMiniChart symbol="OANDA:XAUUSD" locale={lang === 'ar' ? 'ar' : 'en'} attribution={text.attribution} />
          </>
        )}
        <p className="text-xs text-muted-foreground">{text.note}</p>
        <p className="text-xs text-muted-foreground">{text.disclaimer}</p>
      </div>
    </section>
  );
}