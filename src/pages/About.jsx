import BrandLogo from '@/components/finova/BrandLogo';
import MobileNav from '@/components/finova/MobileNav';

export default function About() {
  return (
    <div className="min-h-screen bg-background pb-24 md:pb-10">
      <header className="border-b border-border/50 px-4 md:px-6 py-4">
        <div className="max-w-3xl mx-auto"><BrandLogo showWordmark showBadge /></div>
      </header>
      <main className="max-w-3xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">About FINOVA AI</p>
        <h1 className="text-3xl md:text-5xl font-space font-bold text-foreground tracking-tight mb-6">Financial clarity for the UAE’s next generation</h1>
        <article className="glass-card rounded-3xl border border-border p-6 md:p-9 space-y-5 text-sm md:text-base text-muted-foreground leading-8">
          <p>FINOVA AI is a financial education and planning platform designed to help people understand their money with greater confidence. The app turns everyday figures—monthly income, housing, food, transport, shopping, other expenses, and current savings—into a clear financial stability score. It then explains the factors behind that score, highlights possible risks, and offers practical actions that users can explore at their own pace.</p>
          <p>The platform is built primarily for students and young professionals in the United Arab Emirates. Its examples use AED and reflect familiar local topics such as university life, rent, transport, emergency funds, UAE banks, ADX and DFM markets, and responsible investing. FINOVA AI also provides educational lessons, savings projections, market-learning tools, and a virtual portfolio so users can practise financial decision-making without risking real money.</p>
          <p>FINOVA AI is built and maintained by the FINOVA AI product team, with a focus on accessible technology, responsible financial education, privacy, and clear explanations. Artificial intelligence supports selected educational features, but it does not replace a licensed financial adviser. The app is intended to make financial concepts easier to understand, encourage thoughtful habits, and give young people a practical starting point for stronger long-term financial wellbeing.</p>
        </article>
      </main>
      <MobileNav />
    </div>
  );
}