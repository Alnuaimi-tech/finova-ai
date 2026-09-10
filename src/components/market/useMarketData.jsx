import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function useMarketData() {
  const query = useQuery({
    queryKey: ['twelve-data-market'],
    queryFn: async () => (await base44.functions.invoke('getMarketData', {})).data,
    staleTime: 60000,
    refetchInterval: 65000,
    refetchOnWindowFocus: false,
    retry: false,
  });
  return { ...query, quotes: query.data?.quotes || {}, assets: query.data?.assets || [], issues: query.data?.issues || {} };
}