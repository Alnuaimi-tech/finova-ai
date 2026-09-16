import TradingViewMiniChart from '@/components/market/TradingViewMiniChart';
import QuoteTimestamp from '@/components/market/QuoteTimestamp';

const GROUP_LABELS = { indices: 'Global Indices', stocks: 'Major Stocks', crypto: 'Cryptocurrency', forex: 'Forex' };

const TV_SYMBOLS = {
  'SPY': 'SPY',
  'QQQ': 'QQQ',
  'AAPL': 'NASDAQ:AAPL',
  'NVDA': 'NASDAQ:NVDA',
  'BTC/USD': 'BINANCE:BTCUSDT',
  'ETH/USD': 'BINANCE:ETHUSDT',
  'EUR/USD': 'FX:EURUSD',
  'USD/AED': 'FX:USDAED',
};

export default function OverviewChartCard({ asset, quote }) {
  if (!quote) return null;
  const hasChange = Number.isFinite(quote.changePercent);
  const color = !hasChange ? 'text-muted-foreground' : quote.changePercent >= 0 ? 'text-market-up' : 'text-market-down';
  const tvSymbol = TV_SYMBOLS[asset.symbol] || asset.symbol;
  const groupLabel = GROUP_LABELS[asset.group] || asset.group;
  const subtitle = asset.exchange ? `${asset.exchange} · ${groupLabel}` : groupLabel;
  const decimals = asset.group === 'forex' ? 4 : 2;

  return (
    <article className="glass-card rounded-2xl border border-border p-4">
      <div className="mb-3">
        <p className="text-sm font-bold">{asset.name}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <TradingViewMiniChart symbol={tvSymbol} />
      <div className="mt-3 pt-3 border-t border-border/50">
        <p className="text-lg font-space font-bold">
          {quote.price.toLocaleString('en-US', { maximumFractionDigits: decimals })}{' '}
          <span className="text-xs text-muted-foreground font-medium">{quote.currency || asset.currency || ''}</span>
        </p>
        <p className={`text-xs font-semibold mt-1 ${color}`}>
          {hasChange ? `${quote.changePercent >= 0 ? '+' : ''}${quote.changePercent.toFixed(2)}%` : 'Daily change unavailable'}
        </p>
        <QuoteTimestamp fetchedAt={quote.fetchedAt} />
      </div>
    </article>
  );
}