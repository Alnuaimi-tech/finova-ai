import { Info } from 'lucide-react';

export default function EducationalDisclaimer() {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2">
      <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-300" />
      <p className="text-[11px] leading-relaxed text-amber-200/80">
        <span className="font-semibold text-amber-200">Educational tool.</span> Market &amp; portfolio data may include simulated or demo elements. This is not licensed financial advice — consult a qualified financial advisor for real investment decisions.
      </p>
    </div>
  );
}