import OverviewChartCard from '@/components/market/OverviewChartCard';
import { useLanguage } from '@/lib/LanguageContext';

const GROUPS = ['indices', 'stocks', 'crypto', 'forex'];

export default function LiveMarketOverview({ market }) {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      {GROUPS.map((id) => (
        <section key={id}>
          <h3 className="text-sm font-space font-bold mb-3">{t.mk.groups[id]}</h3>
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