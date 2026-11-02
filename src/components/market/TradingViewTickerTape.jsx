import { useEffect, useRef } from 'react';

// UAE (ADX/DFM) symbols are not available in TradingView's free embed and showed a red "!".
// Only symbols the free ticker can display are listed here.
const symbols = [
  { proName: 'FX_IDC:USDAED', title: 'USD / AED' },
  { proName: 'AMEX:SPY', title: 'S&P 500 ETF' },
  { proName: 'NASDAQ:QQQ', title: 'Nasdaq-100 ETF' },
  { proName: 'NASDAQ:AAPL', title: 'Apple' },
  { proName: 'NASDAQ:NVDA', title: 'NVIDIA' },
  { proName: 'BITSTAMP:BTCUSD', title: 'Bitcoin' },
  { proName: 'BITSTAMP:ETHUSD', title: 'Ethereum' },
  { proName: 'FX:EURUSD', title: 'EUR / USD' },
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