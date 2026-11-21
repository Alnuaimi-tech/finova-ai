import { Info } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function EducationalDisclaimer() {
  const { t } = useLanguage();
  return (
    <div className="flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2">
      <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-300" />
      <p className="text-[11px] leading-relaxed text-amber-200/80">
        {t.mk.disclaimer}
      </p>
    </div>
  );
}