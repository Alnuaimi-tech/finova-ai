import BrandLogo from '@/components/finova/BrandLogo';
import ContactForm from '@/components/finova/ContactForm';
import MobileNav from '@/components/finova/MobileNav';
import SiteFooter from '@/components/finova/SiteFooter';
import SkipLink from '@/components/finova/SkipLink';
import { useLanguage } from '@/lib/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();
  const c = t.contact;
  return (
    <div className="min-h-screen bg-background pb-24 md:pb-10">
      <SkipLink />
      <header className="border-b border-border/50 px-4 md:px-6 py-4">
        <div className="max-w-2xl mx-auto"><BrandLogo showWordmark showBadge /></div>
      </header>
      <main id="main-content" className="max-w-2xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">{c.eyebrow}</p>
        <h1 className="text-3xl md:text-5xl font-space font-bold text-foreground tracking-tight mb-4">{c.title}</h1>
        <p className="text-muted-foreground leading-relaxed mb-4">{c.intro}</p>
        <p className="text-sm text-muted-foreground mb-8">{c.preferEmail}{' '}
          <a href="mailto:finovaai.uae@gmail.com" className="text-primary hover:underline font-medium" dir="ltr">finovaai.uae@gmail.com</a>
        </p>
        <ContactForm />
        <SiteFooter />
      </main>
      <MobileNav />
    </div>
  );
}