import { useLanguage } from '@/lib/LanguageContext';

export default function SkipLink() {
  const { t } = useLanguage() || {};
  const label = (t && t.skipToContent) || 'Skip to content';
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-primary-foreground focus:text-sm focus:font-semibold focus:shadow-lg"
    >
      {label}
    </a>
  );
}