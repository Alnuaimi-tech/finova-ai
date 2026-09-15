import { Link } from 'react-router-dom';
import BrandLogo from '@/components/finova/BrandLogo';
import MobileNav from '@/components/finova/MobileNav';
import SiteFooter from '@/components/finova/SiteFooter';

export default function Terms() {
  return (
    <div className="min-h-screen bg-background pb-24 md:pb-10">
      <header className="border-b border-border/50 px-4 md:px-6 py-4">
        <div className="max-w-3xl mx-auto"><BrandLogo showWordmark showBadge /></div>
      </header>
      <main className="max-w-3xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Legal</p>
        <h1 className="text-3xl md:text-4xl font-space font-bold text-foreground tracking-tight mb-2">Terms of Service</h1>
        <p className="text-xs text-muted-foreground mb-8">Last updated: September 2026</p>
        <article className="glass-card rounded-3xl border border-border p-6 md:p-9 space-y-6 text-sm md:text-base text-muted-foreground leading-7">
          <section>
            <h2 className="text-foreground font-semibold text-base mb-2">1. Acceptance of Terms</h2>
            <p>By accessing or using FINOVA AI ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.</p>
          </section>
          <section>
            <h2 className="text-foreground font-semibold text-base mb-2">2. Educational Purpose — Not Financial Advice</h2>
            <p>FINOVA AI is an educational tool designed to help users explore personal finance concepts. The Financial Health Score, AI Coach responses, market data, portfolio simulator, and all other outputs are provided for informational and educational purposes only. They do not constitute licensed financial, investment, legal, or tax advice. You should consult a qualified, licensed financial advisor before making any real investment or financial decisions.</p>
          </section>
          <section>
            <h2 className="text-foreground font-semibold text-base mb-2">3. Simulated &amp; Demo Data</h2>
            <p>Market and portfolio features may include simulated, illustrative, or demo data. Some instruments (for example, DFM-listed stocks) are displayed using demo prices because a licensed real-time data feed is not available at this project's scale. No figure presented should be treated as a live or guaranteed real-time market price. The virtual portfolio uses virtual funds only — no real money is involved.</p>
          </section>
          <section>
            <h2 className="text-foreground font-semibold text-base mb-2">4. User Accounts &amp; Inputs</h2>
            <p>You are responsible for the accuracy of the financial information you enter and for maintaining the confidentiality of your account credentials. You agree not to misuse the Service, attempt to disrupt it, or use it for any unlawful purpose.</p>
          </section>
          <section>
            <h2 className="text-foreground font-semibold text-base mb-2">5. Third-Party Services</h2>
            <p>The Service integrates third-party tools for market data and AI features. We do not control and are not responsible for the accuracy or availability of third-party data, widgets, or models.</p>
          </section>
          <section>
            <h2 className="text-foreground font-semibold text-base mb-2">6. Disclaimer of Warranties</h2>
            <p>The Service is provided "as is" and "as available" without warranties of any kind. We do not guarantee that the Service will be error-free, uninterrupted, or that results will be accurate or suitable for your situation.</p>
          </section>
          <section>
            <h2 className="text-foreground font-semibold text-base mb-2">7. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, FINOVA AI and its authors shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of, or reliance on, the Service.</p>
          </section>
          <section>
            <h2 className="text-foreground font-semibold text-base mb-2">8. Changes to These Terms</h2>
            <p>We may update these Terms from time to time. Continued use of the Service after changes are posted constitutes acceptance of the revised Terms.</p>
          </section>
          <section>
            <h2 className="text-foreground font-semibold text-base mb-2">9. Governing Law</h2>
            <p>These Terms are governed by the laws of the United Arab Emirates.</p>
          </section>
          <section>
            <h2 className="text-foreground font-semibold text-base mb-2">10. Contact</h2>
            <p>Questions about these Terms? Reach out via the <Link to="/contact" className="text-primary hover:underline">Contact</Link> page.</p>
          </section>
        </article>
        <SiteFooter />
      </main>
      <MobileNav />
    </div>
  );
}