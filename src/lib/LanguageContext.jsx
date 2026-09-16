import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    dir: 'ltr',
    // Nav
    home: 'Home', dashboard: 'Dashboard', market: 'Market', learn: 'Learn', profile: 'Profile',
    // Home hero
    tagline: '#1 Financial App for UAE Students',
    heroTitle1: 'Your personal',
    heroTitle2: 'money coach',
    heroTitle3: '',
    heroDesc: 'Get your Financial Health Score in 2 minutes. FINOVA AI analyzes your income, spending, and savings to give you a clear action plan — all in AED, built for UAE students and young professionals.',
    ctaPrimary: 'Check My Financial Score',
    ctaSecondary: 'Learn First',
    tryFree: 'Try Free',
    // Stats
    stat1Label: 'UAE Students', stat1Sub: 'Using FINOVA AI',
    stat2Label: 'Currency', stat2Sub: 'Fully localized',
    stat3Label: 'Analysis', stat3Sub: 'Get your score fast',
    stat4Label: 'Free', stat4Sub: 'No credit card',
    // Features
    feat1Title: 'Financial Score', feat1Desc: 'Your money health in one clear number — 0 to 100',
    feat2Title: 'AI Coach', feat2Desc: 'Personalized advice based on your real UAE spending patterns',
    feat3Title: 'Market Tracker', feat3Desc: 'Follow ADX & DFM stocks. Learn investing the smart way',
    feat4Title: 'Money Lessons', feat4Desc: 'Short, practical guides made for UAE students & young adults',
    feat5Title: 'Goal Tracker', feat5Desc: 'Set savings goals and track your progress every month',
    feat6Title: 'Emergency Fund', feat6Desc: 'Build a safety net — 3 months of expenses as a buffer',
    // How it works
    howItWorks: 'How FINOVA AI Works',
    step1Title: 'Enter Your Numbers', step1Desc: 'Income, rent, food, transport — takes 2 minutes',
    step2Title: 'AI Analyzes Your Data', step2Desc: 'Our engine scores your finances 0–100 using UAE benchmarks',
    step3Title: 'Get Your Action Plan', step3Desc: 'Personalized tips, predictions, and goals to improve your score',
    // UAE Banner
    uaeTitle: 'Built for the UAE',
    uaeDesc: 'AED currency · UAE university expenses · Metro & Salik transport · Etisalat/du mobile plans · ADX & DFM investing education · UAE banking guide',
    getMyScore: 'Get My Score',
    // Bottom CTA
    bottomCta: 'Try FINOVA AI — 100% Free',
    // InputForm
    enterData: 'Enter Your Financial Data',
    aiAnalysis: 'AI-Powered Financial Analysis',
    monthlyIncome: 'Monthly Income',
    incomeDesc: 'Salary, allowance, or any regular income',
    monthlyExpenses: 'Monthly Expenses',
    expensesDesc: 'Break down your spending by category',
    currentSavings: 'Current Savings',
    savingsDesc: 'Total savings or emergency fund balance',
    runAnalysis: 'Run AI Financial Analysis',
    analyzing: 'AI is analyzing your data...',
    dataPrivate: '🔒 Your data is processed locally and never shared',
    // Demo
    demoTitle: 'Get Your Financial Score — Free',
    demoSubtitle: 'No account needed. Takes 2 minutes.',
  },
  ar: {
    dir: 'rtl',
    // Nav
    home: 'الرئيسية', dashboard: 'لوحتي', market: 'السوق', learn: 'تعلم', profile: 'ملفي',
    // Home hero
    tagline: 'التطبيق المالي الأول لطلاب الإمارات',
    heroTitle1: 'مستشارك المالي',
    heroTitle2: 'الشخصي',
    heroTitle3: '',
    heroDesc: 'احصل على نقاط صحتك المالية في دقيقتين. فينوفا AI يحلل دخلك وإنفاقك ومدخراتك ليمنحك خطة عمل واضحة — بالدرهم الإماراتي، مصمم لطلاب وشباب الإمارات.',
    ctaPrimary: 'تحقق من نقاطي المالية',
    ctaSecondary: 'تعلم أولاً',
    tryFree: 'جرب مجاناً',
    // Stats
    stat1Label: 'طالب إماراتي', stat1Sub: 'يستخدمون فينوفا',
    stat2Label: 'العملة', stat2Sub: 'درهم إماراتي',
    stat3Label: 'التحليل', stat3Sub: 'احصل على نقاطك بسرعة',
    stat4Label: '100%', stat4Sub: 'مجاني تماماً',
    // Features
    feat1Title: 'النقاط المالية', feat1Desc: 'صحة أموالك في رقم واحد من 0 إلى 100',
    feat2Title: 'مستشار ذكي', feat2Desc: 'نصائح مخصصة بناءً على أنماط إنفاقك الفعلية في الإمارات',
    feat3Title: 'تتبع السوق', feat3Desc: 'تابع أسهم سوق أبوظبي ودبي. تعلم الاستثمار بذكاء',
    feat4Title: 'دروس مالية', feat4Desc: 'أدلة قصيرة وعملية مصممة لطلاب الإمارات والشباب',
    feat5Title: 'متابعة الأهداف', feat5Desc: 'حدد أهداف المدخرات وتابع تقدمك كل شهر',
    feat6Title: 'صندوق الطوارئ', feat6Desc: 'ابنِ شبكة أمان — 3 أشهر من النفقات كاحتياطي',
    // How it works
    howItWorks: 'كيف يعمل فينوفا AI',
    step1Title: 'أدخل أرقامك', step1Desc: 'الدخل، الإيجار، الطعام، المواصلات — يستغرق دقيقتين',
    step2Title: 'الذكاء الاصطناعي يحلل بياناتك', step2Desc: 'محركنا يقيّم أموالك من 0 إلى 100 باستخدام معايير الإمارات',
    step3Title: 'احصل على خطة عملك', step3Desc: 'نصائح مخصصة وتوقعات وأهداف لتحسين نقاطك',
    // UAE Banner
    uaeTitle: 'مصنوع للإمارات',
    uaeDesc: 'الدرهم الإماراتي · نفقات جامعات الإمارات · مترو وسالك · باقات اتصالات/دو · تعليم الاستثمار في سوق أبوظبي ودبي · دليل البنوك الإماراتية',
    getMyScore: 'احصل على نقاطي',
    // Bottom CTA
    bottomCta: 'جرب فينوفا AI — مجاناً 100%',
    // InputForm
    enterData: 'أدخل بياناتك المالية',
    aiAnalysis: 'تحليل مالي بالذكاء الاصطناعي',
    monthlyIncome: 'الدخل الشهري',
    incomeDesc: 'الراتب، بدل، أو أي دخل منتظم',
    monthlyExpenses: 'المصاريف الشهرية',
    expensesDesc: 'صنف إنفاقك حسب الفئة',
    currentSavings: 'المدخرات الحالية',
    savingsDesc: 'إجمالي المدخرات أو رصيد صندوق الطوارئ',
    runAnalysis: 'شغّل تحليل الذكاء الاصطناعي',
    analyzing: 'الذكاء الاصطناعي يحلل بياناتك...',
    dataPrivate: '🔒 بياناتك تُعالج محلياً ولا تُشارك أبداً',
    // Demo
    demoTitle: 'احصل على نقاطك المالية — مجاناً',
    demoSubtitle: 'لا حاجة لحساب. يستغرق دقيقتين.',
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('finova_lang') || 'en');

  useEffect(() => {
    localStorage.setItem('finova_lang', lang);
    document.documentElement.dir = translations[lang].dir;
    document.documentElement.lang = lang;
  }, [lang]);

  const toggle = () => setLang(l => l === 'en' ? 'ar' : 'en');
  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}