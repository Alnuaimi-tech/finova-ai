import { useEffect, useRef, useState } from 'react';

export default function TradingViewDFMChart({ symbol }) {
  const container = useRef(null);
  const [mode, setMode] = useState('advanced');

  useEffect(() => {
    const host = container.current;
    const embed = document.createElement('div');
    embed.className = 'tradingview-widget-container';
    const widget = document.createElement('div');
    widget.className = 'tradingview-widget-container__widget';
    embed.appendChild(widget);
    const script = document.createElement('script');
    script.src = `https://s3.tradingview.com/external-embedding/embed-widget-${mode === 'advanced' ? 'advanced-chart' : 'symbol-overview'}.js`;
    script.async = true;
    const common = { width: '100%', height: 340, autosize: false, locale: 'en' };
    script.textContent = JSON.stringify(mode === 'advanced' ? {
      ...common, symbol, interval: 'D', timezone: 'Asia/Dubai', theme: 'dark',
      style: '1', allow_symbol_change: false, hide_top_toolbar: false,
      hide_side_toolbar: true, save_image: false, calendar: false, support_host: 'https://www.tradingview.com',
    } : {
      ...common, symbols: [[symbol, `${symbol}|1D`]], colorTheme: 'dark',
      isTransparent: true, chartOnly: false, showVolume: false, showMA: false,
      hideDateRanges: false, hideMarketStatus: false, hideSymbolLogo: false,
      scalePosition: 'right', scaleMode: 'Normal', chartType: 'area',
    });
    embed.appendChild(script);
    host.appendChild(embed);
    return () => { embed.remove(); };
  }, [symbol, mode]);

  return <div className="w-full min-w-0 space-y-2">
    <div ref={container} className="min-h-[340px] w-full overflow-hidden rounded-xl" />
    <p className="text-[10px] text-muted-foreground"><a href={`https://www.tradingview.com/symbols/${symbol.replace(':', '-')}/`} target="_blank" rel="noreferrer" className="text-primary hover:underline">{symbol} chart</a> by TradingView</p>
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="text-muted-foreground">{mode === 'advanced' ? 'Symbol not displaying?' : 'Using Symbol Overview'}</span>
      <button type="button" onClick={() => setMode(mode === 'advanced' ? 'overview' : 'advanced')} className="rounded-lg border border-border px-3 py-1.5 text-primary hover:bg-primary/10">
        {mode === 'advanced' ? 'Try Symbol Overview' : 'Back to Advanced Chart'}
      </button>
    </div>
  </div>;
}