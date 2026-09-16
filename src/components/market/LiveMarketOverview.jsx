import OverviewChartCard from '@/components/market/OverviewChartCard';

const groups = [['indices', 'Global Indices'], ['stocks', 'Major Stocks'], ['crypto', 'Cryptocurrency'], ['forex', 'Forex']];

export default function LiveMarketOverview({ market }) {
  return (
    <div className="space-y-6">
      {groups.map(([id, title]) => (
        <section key={id}>
          <h3 className="text-sm font-space font-bold mb-3">{title}</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {market.assets.filter(a => a.group === id).map(asset => (
              <OverviewChartCard key={asset.symbol} asset={asset} quote={market.quotes[asset.symbol]} issue={market.issues[asset.symbol]} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}