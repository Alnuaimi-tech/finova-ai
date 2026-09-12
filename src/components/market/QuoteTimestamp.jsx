import { useEffect, useState } from 'react';

export default function QuoteTimestamp({ fetchedAt }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);
  const minutes = Math.max(0, Math.floor((now - Date.parse(fetchedAt)) / 60000));
  return <p className="text-[10px] text-muted-foreground mt-2" title={new Date(fetchedAt).toLocaleString()}>
    {minutes < 1 ? 'Last updated just now' : `Last updated ${minutes} minute${minutes === 1 ? '' : 's'} ago`} · Last known price
  </p>;
}