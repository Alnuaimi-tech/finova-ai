import LegalPage from '@/components/finova/LegalPage';
import { useLanguage } from '@/lib/LanguageContext';

export default function Privacy() {
  const { t } = useLanguage();
  return <LegalPage doc={t.legal.privacy} />;
}