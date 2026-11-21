import { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

export default function QuoteTimestamp({ fetchedAt }) {
  const { t } = useLanguage();
  const mk = t.mk;
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);
  const minutes = Math.max(0, Math.floor((now - Date.parse(fetchedAt)) / 60000));
  const age = minutes < 1 ? mk.statusJustNow : mk.statusMinutes(minutes);
  return <p className="text-[10px] text-muted-foreground mt-2" title={new Date(fetchedAt).toLocaleString()}>
    {age} · {mk.lastKnown}
  </p>;
}