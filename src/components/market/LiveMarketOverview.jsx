import MarketQuoteCard from '@/components/market/MarketQuoteCard';

const groups = [['indices', 'Global Indices'], ['stocks', 'Major Stocks'], ['crypto', 'Cryptocurrency'], ['forex', 'Forex']];

export default function LiveMarketOverview({ market }) {
  return (
    <div className="space-y-6">
      {groups.map(([id, title]) => (
        <section key={id}>
          <h3 className="text-sm font-space font-bold mb-3">{title}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {market.assets.filter(a => a.group === id).map(asset => (
              <MarketQuoteCard key={asset.symbol} asset={asset} quote={market.quotes[asset.symbol]} issue={market.issues[asset.symbol]} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}