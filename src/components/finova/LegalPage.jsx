import { Link } from 'react-router-dom';
import BrandLogo from '@/components/finova/BrandLogo';
import MobileNav from '@/components/finova/MobileNav';
import SiteFooter from '@/components/finova/SiteFooter';
import SkipLink from '@/components/finova/SkipLink';
import { useLanguage } from '@/lib/LanguageContext';

function Segments({ parts, contactLabel }) {
  return parts.map((seg, i) => {
    if (typeof seg === 'string') return <span key={i}>{seg}</span>;
    if (seg.b) return <span key={i} className="text-foreground">{seg.b}</span>;
    if (seg.link) return <Link key={i} to="/contact" className="text-primary hover:underline">{contactLabel}</Link>;
    return null;
  });
}

export default function LegalPage({ doc }) {
  const { t } = useLanguage();
  const contactLabel = t.legal.contactLink;
  return (
    <div className="min-h-screen bg-background pb-24 md:pb-10">
      <SkipLink />
      <header className="border-b border-border/50 px-4 md:px-6 py-4">
        <div className="max-w-3xl mx-auto"><BrandLogo showWordmark showBadge /></div>
      </header>
      <main id="main-content" className="max-w-3xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">{t.legal.eyebrow}</p>
        <h1 className="text-3xl md:text-4xl font-space font-bold text-foreground tracking-tight mb-2">{doc.title}</h1>
        <p className="text-xs text-muted-foreground mb-8">{doc.updated}</p>
        <article className="glass-card rounded-3xl border border-border p-6 md:p-9 space-y-6 text-sm md:text-base text-muted-foreground leading-7">
          {doc.sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-foreground font-semibold text-base mb-2">{section.h}</h2>
              {section.p.map((para, j) => (
                <p key={j} className={j > 0 ? 'mt-3' : ''}>
                  <Segments parts={para} contactLabel={contactLabel} />
                </p>
              ))}
            </section>
          ))}
        </article>
        <SiteFooter />
      </main>
      <MobileNav />
    </div>
  );
}