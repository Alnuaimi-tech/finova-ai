import { useEffect, useRef } from 'react';

const symbols = [
  { proName: 'DFM:DFMGI', title: 'DFM General Index' },
  { proName: 'ADX:FADGI', title: 'ADX General Index' },
  { proName: 'DFM:EMAAR', title: 'Emaar Properties' },
  { proName: 'ADX:ADCB', title: 'Abu Dhabi Commercial Bank' },
  { proName: 'ADX:ADIB', title: 'Abu Dhabi Islamic Bank' },
  { proName: 'ADX:ADNOCDIST', title: 'ADNOC Distribution' },
  { proName: 'DFM:ALDAR', title: 'Aldar Properties' },
  { proName: 'DFM:EMIRATESNBD', title: 'Emirates NBD' },
];

export default function TradingViewTickerTape() {
  const container = useRef(null);

  useEffect(() => {
    if (!container.current) return;
    container.current.innerHTML = '<div class="tradingview-widget-container__widget"></div>';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;
    script.textContent = JSON.stringify({ symbols, showSymbolLogo: true, isTransparent: true, displayMode: 'adaptive', colorTheme: 'dark', locale: 'en' });
    container.current.appendChild(script);
    return () => { if (container.current) container.current.innerHTML = ''; };
  }, []);

  return <div ref={container} className="tradingview-widget-container min-h-[46px] border-b border-border/40 bg-secondary/20" />;
}