import BrandLogo from '@/components/finova/BrandLogo';
import ContactForm from '@/components/finova/ContactForm';
import MobileNav from '@/components/finova/MobileNav';

export default function Contact() {
  return (
    <div className="min-h-screen bg-background pb-24 md:pb-10">
      <header className="border-b border-border/50 px-4 md:px-6 py-4">
        <div className="max-w-2xl mx-auto"><BrandLogo showWordmark showBadge /></div>
      </header>
      <main className="max-w-2xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Contact FINOVA AI</p>
        <h1 className="text-3xl md:text-5xl font-space font-bold text-foreground tracking-tight mb-4">We’re here to help</h1>
        <p className="text-muted-foreground leading-relaxed mb-8">Send the FINOVA AI team a question, suggestion, or report. Include the email address where you would like us to reply.</p>
        <ContactForm />
      </main>
      <MobileNav />
    </div>
  );
}