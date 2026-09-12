import MarketQuoteCard from '@/components/market/MarketQuoteCard';

const indices = [
  { symbol: 'ADI', name: 'ADX General Index', exchange: 'ADX', venue: 'Abu Dhabi Securities Exchange', group: 'uae_indices' },
  { symbol: 'DFMGI', name: 'DFM General Index', exchange: 'DFM', venue: 'Dubai Financial Market', group: 'uae_indices' },
];

export default function UAEIndicesSection({ market }) {
  return <section>
    <h3 className="text-sm font-space font-bold mb-3">UAE Indices</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {indices.map(asset => market.quotes[asset.symbol] ? (
        <MarketQuoteCard key={asset.symbol} asset={asset} quote={market.quotes[asset.symbol]} />
      ) : (
        <div key={asset.symbol} className="glass-card rounded-2xl border border-border p-4">
          <p className="text-sm font-space font-bold text-foreground">{asset.name}</p>
          <p className="text-xs text-muted-foreground mt-1">{asset.venue}</p>
          <p className="text-xs text-muted-foreground mt-3" role="status">{market.isPending ? 'Loading stored index values…' : market.issues[asset.symbol] ? 'Twelve Data has not supplied this index on the connected plan. No value has been stored yet.' : 'Awaiting the first scheduled index quote from Twelve Data.'}</p>
        </div>
      ))}
    </div>
    <p className="text-xs text-muted-foreground mt-2">Index levels in points · Scheduled updates · Last-known values stay visible if a refresh fails.</p>
  </section>;
}