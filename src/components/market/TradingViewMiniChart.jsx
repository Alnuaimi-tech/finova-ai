import { useEffect, useRef } from 'react';

export default function TradingViewMiniChart({ symbol, height = 220 }) {
  const container = useRef(null);

  useEffect(() => {
    if (!container.current) return;
    container.current.innerHTML = '<div class="tradingview-widget-container__widget"></div>';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
    script.async = true;
    script.textContent = JSON.stringify({ symbol, width: '100%', height, locale: 'en', dateRange: '1D', colorTheme: 'dark', isTransparent: true, autosize: false, largeChartUrl: '' });
    container.current.appendChild(script);
    return () => { if (container.current) container.current.innerHTML = ''; };
  }, [symbol, height]);

  return <div className="tradingview-widget-container w-full overflow-hidden rounded-xl"><div ref={container} /><p className="mt-1 text-[10px] text-muted-foreground">Live market chart by <a href={`https://www.tradingview.com/symbols/${symbol.replace(':', '-')}/`} target="_blank" rel="noreferrer" className="text-primary hover:underline">TradingView</a></p></div>;
}