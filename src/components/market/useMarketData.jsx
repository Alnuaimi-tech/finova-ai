import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function useMarketData() {
  const query = useQuery({
    queryKey: ['stored-market-data'],
    queryFn: async () => {
      const records = await base44.entities.MarketDataCache.filter({ key: 'twelve-data-v2' }, '-updated_date', 1);
      return records[0] || null;
    },
    staleTime: 30000,
    refetchInterval: 60000,
    refetchOnWindowFocus: false,
  });
  const quotes = query.data?.quotes || {};
  return {
    ...query,
    quotes,
    assets: Object.values(quotes),
    issues: query.data?.issues || {},
  };
}