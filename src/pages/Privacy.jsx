import { Link } from 'react-router-dom';
import BrandLogo from '@/components/finova/BrandLogo';
import MobileNav from '@/components/finova/MobileNav';
import SiteFooter from '@/components/finova/SiteFooter';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background pb-24 md:pb-10">
      <header className="border-b border-border/50 px-4 md:px-6 py-4">
        <div className="max-w-3xl mx-auto"><BrandLogo showWordmark showBadge /></div>
      </header>
      <main className="max-w-3xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Legal</p>
        <h1 className="text-3xl md:text-4xl font-space font-bold text-foreground tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-xs text-muted-foreground mb-8">Last updated: September 2026</p>
        <article className="glass-card rounded-3xl border border-border p-6 md:p-9 space-y-6 text-sm md:text-base text-muted-foreground leading-7">
          <section>
            <h2 className="text-foreground font-semibold text-base mb-2">1. Information We Collect</h2>
            <p>When you use FINOVA AI, we may collect: <span className="text-foreground">account information</span> such as your name and email (managed by the platform's authentication); <span className="text-foreground">financial inputs</span> you enter for analysis (income, expenses, savings); and <span className="text-foreground">usage events</span> such as app opens and logins used for aggregate analytics.</p>
          </section>
          <section>
            <h2 className="text-foreground font-semibold text-base mb-2">2. How We Use Your Data</h2>
            <p>Your inputs power your personal Financial Health Score, AI Coach responses, and portfolio simulations. Usage events help us understand and improve the Service. We do not sell your personal data.</p>
          </section>
          <section>
            <h2 className="text-foreground font-semibold text-base mb-2">3. Data Storage</h2>
            <p>Your data is stored securely on the Base44 platform infrastructure that hosts the Service. Financial profiles and virtual holdings are associated with your account and protected by role-based access control — only you and authorized admins can access your records.</p>
          </section>
          <section>
            <h2 className="text-foreground font-semibold text-base mb-2">4. AI &amp; Third-Party Services</h2>
            <p>To deliver AI coaching and market data, the Service sends your prompts and inputs to third-party AI models and market-data providers. Avoid entering sensitive personal data beyond what the Service requires. Third-party widgets (such as TradingView) may set their own cookies in accordance with their own policies.</p>
          </section>
          <section>
            <h2 className="text-foreground font-semibold text-base mb-2">5. Local Storage</h2>
            <p>The Service uses your browser's local storage and session storage to remember preferences such as your language choice and in-progress analysis data. This data stays on your device.</p>
          </section>
          <section>
            <h2 className="text-foreground font-semibold text-base mb-2">6. Your Rights</h2>
            <p>You may request access to or deletion of your data by contacting us. You can also sign out or stop using the Service at any time.</p>
          </section>
          <section>
            <h2 className="text-foreground font-semibold text-base mb-2">7. Children's Privacy</h2>
            <p>FINOVA AI is designed for students and young adults. The Service is not directed at children under 13, and we do not knowingly collect data from them.</p>
          </section>
          <section>
            <h2 className="text-foreground font-semibold text-base mb-2">8. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Continued use of the Service after changes are posted constitutes acceptance of the revised policy.</p>
          </section>
          <section>
            <h2 className="text-foreground font-semibold text-base mb-2">9. Contact</h2>
            <p>Questions about privacy? Reach out via the <Link to="/contact" className="text-primary hover:underline">Contact</Link> page.</p>
          </section>
        </article>
        <SiteFooter />
      </main>
      <MobileNav />
    </div>
  );
}