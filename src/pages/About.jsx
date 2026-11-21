import BrandLogo from '@/components/finova/BrandLogo';
import MobileNav from '@/components/finova/MobileNav';
import SiteFooter from '@/components/finova/SiteFooter';
import SkipLink from '@/components/finova/SkipLink';
import { useLanguage } from '@/lib/LanguageContext';

export default function About() {
  const { t } = useLanguage();
  const a = t.about;
  return (
    <div className="min-h-screen bg-background pb-24 md:pb-10">
      <SkipLink />
      <header className="border-b border-border/50 px-4 md:px-6 py-4">
        <div className="max-w-3xl mx-auto"><BrandLogo showWordmark showBadge /></div>
      </header>
      <main id="main-content" className="max-w-3xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">{a.eyebrow}</p>
        <h1 className="text-3xl md:text-5xl font-space font-bold text-foreground tracking-tight mb-6">{a.title}</h1>
        <article className="glass-card rounded-3xl border border-border p-6 md:p-9 space-y-5 text-sm md:text-base text-muted-foreground leading-8">
          <p>{a.p1}</p>
          <p>{a.p2}</p>
          <p>{a.p3}</p>

          <div className="pt-2">
            <h2 className="text-lg md:text-xl font-space font-bold text-foreground mb-4">{a.dataTitle}</h2>
            <div className="space-y-4">
              <p><strong className="text-foreground">{a.d1Label}</strong> {a.d1}</p>
              <p><strong className="text-foreground">{a.d2Label}</strong> {a.d2}</p>
              <p><strong className="text-foreground">{a.d3Label}</strong> {a.d3}</p>
            </div>
          </div>
        </article>
        <SiteFooter />
      </main>
      <MobileNav />
    </div>
  );
}