/**
 * FINOVA AI — Financial Analysis Engine v2
 * Core scoring, risk classification, prediction, and reasoning logic
 */

export function calculateFinancialScore(data) {
  const { monthly_income, rent, food, transport, shopping, other, current_savings } = data;

  const totalExpenses = (rent || 0) + (food || 0) + (transport || 0) + (shopping || 0) + (other || 0);
  const monthlySurplus = monthly_income - totalExpenses;
  const savingsRate = monthly_income > 0 ? (monthlySurplus / monthly_income) * 100 : 0;
  const expenseRatio = monthly_income > 0 ? (totalExpenses / monthly_income) * 100 : 100;
  const shoppingRatio = monthly_income > 0 ? (shopping || 0) / monthly_income * 100 : 0;
  const rentRatio = monthly_income > 0 ? (rent || 0) / monthly_income * 100 : 0;

  // Savings rate score (0–100), weighted 40%
  // Ideal: 20%+ savings rate = 100 pts, 0% = 0 pts
  const savingsScore = Math.max(0, Math.min(100, (savingsRate / 20) * 100));

  // Expense ratio score (0–100), weighted 30%
  // Ideal: <70% expenses = 100 pts, 100%+ = 0 pts
  const expenseScore = Math.max(0, Math.min(100, ((100 - expenseRatio) / 30) * 100));

  // Risky spending score (0–100), weighted 30%
  // Shopping < 10% = 100, 30%+ = 0
  const riskySpendScore = Math.max(0, Math.min(100, ((20 - shoppingRatio) / 20) * 100));

  // Emergency fund bonus (up to +10 pts): 3+ months coverage = full bonus
  const monthsOfRunway = (current_savings || 0) > 0 && totalExpenses > 0
    ? (current_savings || 0) / totalExpenses
    : 0;
  const emergencyBonus = Math.min(10, (monthsOfRunway / 3) * 10);

  const finalScore = Math.round(
    savingsScore * 0.35 +
    expenseScore * 0.28 +
    riskySpendScore * 0.27 +
    emergencyBonus
  );

  return {
    score: Math.max(0, Math.min(100, finalScore)),
    savingsRate: Math.round(savingsRate * 10) / 10,
    expenseRatio: Math.round(expenseRatio * 10) / 10,
    shoppingRatio: Math.round(shoppingRatio * 10) / 10,
    rentRatio: Math.round(rentRatio * 10) / 10,
    totalExpenses,
    monthlySurplus,
    monthsOfRunway: Math.round(monthsOfRunway * 10) / 10,
    savingsScore: Math.round(savingsScore),
    expenseScore: Math.round(expenseScore),
    riskySpendScore: Math.round(riskySpendScore),
    emergencyBonus: Math.round(emergencyBonus),
  };
}

export function classifyRisk(score) {
  if (score < 40) return 'High Risk';
  if (score < 70) return 'Medium Risk';
  return 'Low Risk';
}

export function getRiskColor(riskLevel) {
  switch (riskLevel) {
    case 'High Risk': return { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', hex: '#f43f5e' };
    case 'Medium Risk': return { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', hex: '#f59e0b' };
    case 'Low Risk': return { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', hex: '#10b981' };
    default: return { text: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30', hex: '#94a3b8' };
  }
}

export function generateAIExplanations(data, metrics) {
  const explanations = [];
  const { monthly_income, rent, food, transport, shopping, other, current_savings } = data;
  const { savingsRate, expenseRatio, shoppingRatio, rentRatio, totalExpenses, monthlySurplus } = metrics;

  // Rent analysis
  if (rentRatio > 50) {
    explanations.push({
      type: 'critical',
      icon: 'home',
      title: 'Critical: Housing Cost Burden',
      text: `Your rent consumes ${rentRatio.toFixed(0)}% of your income, which is significantly above the recommended 30% threshold. This severely limits your financial flexibility and savings potential.`
    });
  } else if (rentRatio > 30) {
    explanations.push({
      type: 'warning',
      icon: 'home',
      title: 'Housing Cost Elevated',
      text: `Your rent is ${rentRatio.toFixed(0)}% of your monthly income. The recommended maximum is 30%. Consider exploring shared accommodation or university housing options.`
    });
  } else {
    explanations.push({
      type: 'positive',
      icon: 'home',
      title: 'Housing Cost Healthy',
      text: `Your rent at ${rentRatio.toFixed(0)}% of income is within a sustainable range. This gives you room to allocate more toward savings and investments.`
    });
  }

  // Savings rate analysis
  if (savingsRate <= 0) {
    explanations.push({
      type: 'critical',
      icon: 'piggy',
      title: 'No Monthly Savings Detected',
      text: `You are spending more than you earn (deficit of AED ${Math.abs(monthlySurplus).toLocaleString()} monthly). This pattern leads to debt accumulation and financial instability.`
    });
  } else if (savingsRate < 10) {
    explanations.push({
      type: 'warning',
      icon: 'piggy',
      title: 'Low Savings Rate',
      text: `Your savings rate of ${savingsRate.toFixed(1)}% is below the recommended 20%. At this pace, you have minimal buffer for emergencies and limited long-term wealth building.`
    });
  } else if (savingsRate < 20) {
    explanations.push({
      type: 'neutral',
      icon: 'piggy',
      title: 'Moderate Savings Rate',
      text: `You are saving ${savingsRate.toFixed(1)}% of your income (AED ${monthlySurplus.toLocaleString()}/month). This is a positive start, but increasing to 20% would significantly improve your financial resilience.`
    });
  } else {
    explanations.push({
      type: 'positive',
      icon: 'piggy',
      title: 'Strong Savings Behavior',
      text: `Excellent — you are saving ${savingsRate.toFixed(1)}% of your income monthly. This places you in a strong position for financial growth and emergency preparedness.`
    });
  }

  // Shopping / discretionary spending
  if (shoppingRatio > 25) {
    explanations.push({
      type: 'critical',
      icon: 'shopping',
      title: 'Risky Discretionary Spending',
      text: `Shopping accounts for ${shoppingRatio.toFixed(0)}% of your income, a significant risk factor. High discretionary spending is the leading cause of student financial instability in the UAE.`
    });
  } else if (shoppingRatio > 15) {
    explanations.push({
      type: 'warning',
      icon: 'shopping',
      title: 'Discretionary Spending Alert',
      text: `You are allocating ${shoppingRatio.toFixed(0)}% of your income to shopping. Reducing this to under 10% could free up AED ${Math.round((shoppingRatio - 10) / 100 * monthly_income).toLocaleString()} monthly for savings.`
    });
  }

  // Overall expense ratio
  if (expenseRatio > 90) {
    explanations.push({
      type: 'critical',
      icon: 'chart',
      title: 'Expense-to-Income Ratio Critical',
      text: `Total expenses consume ${expenseRatio.toFixed(0)}% of your income, leaving virtually no buffer. A single unexpected expense could push you into financial distress.`
    });
  } else if (expenseRatio > 75) {
    explanations.push({
      type: 'warning',
      icon: 'chart',
      title: 'High Expense Ratio',
      text: `Your expense-to-income ratio of ${expenseRatio.toFixed(0)}% leaves limited room for savings. Financial advisors recommend keeping total expenses below 70% of income.`
    });
  }

  // Current savings context
  if (current_savings > 0 && monthly_income > 0) {
    const monthsOfRunway = current_savings / totalExpenses;
    if (monthsOfRunway < 3) {
      explanations.push({
        type: 'warning',
        icon: 'shield',
        title: 'Emergency Fund Insufficient',
        text: `Your current savings of AED ${current_savings.toLocaleString()} covers only ${monthsOfRunway.toFixed(1)} months of expenses. Financial experts recommend maintaining a 3–6 month emergency fund.`
      });
    } else {
      explanations.push({
        type: 'positive',
        icon: 'shield',
        title: 'Emergency Fund Adequate',
        text: `Your savings provide ${monthsOfRunway.toFixed(1)} months of expense coverage — meeting the recommended 3-month minimum emergency buffer.`
      });
    }
  }

  return explanations;
}

export function generatePredictions(data, metrics) {
  const { current_savings } = data;
  const { monthlySurplus, savingsRate, expenseRatio } = metrics;

  const predictions = [];
  const months = [1, 2, 3];

  months.forEach(month => {
    const projectedSavings = (current_savings || 0) + (monthlySurplus * month);
    predictions.push({
      month,
      projectedSavings: Math.round(projectedSavings),
      surplus: Math.round(monthlySurplus),
    });
  });

  // Generate narrative
  let narrative = '';
  const month3Savings = predictions[2].projectedSavings;

  if (monthlySurplus <= 0) {
    narrative = `⚠️ At your current spending pace, you will accumulate AED ${Math.abs(monthlySurplus * 3).toLocaleString()} in debt over the next 3 months. Immediate corrective action is strongly recommended.`;
  } else if (savingsRate < 10) {
    narrative = `📈 If current behavior continues, your savings will grow to AED ${month3Savings.toLocaleString()} in 3 months — a modest improvement. Optimizing one expense category could significantly accelerate this.`;
  } else {
    narrative = `🚀 Based on current trajectory, your savings are projected to reach AED ${month3Savings.toLocaleString()} in 3 months. Maintaining this discipline positions you for strong financial growth.`;
  }

  return { predictions, narrative };
}

export function getRiskTrend(metrics) {
  const { savingsRate, expenseRatio } = metrics;
  if (savingsRate >= 20 && expenseRatio <= 70) return { label: 'Improving', color: 'text-emerald-400', bg: 'bg-emerald-500/10', arrow: '↑' };
  if (savingsRate >= 10 && expenseRatio <= 85) return { label: 'Stable', color: 'text-amber-400', bg: 'bg-amber-500/10', arrow: '→' };
  return { label: 'Worsening', color: 'text-rose-400', bg: 'bg-rose-500/10', arrow: '↓' };
}

export function simulateScenario(data, metrics, scenarioType) {
  let modified = { ...data };
  let label = '';
  if (scenarioType === 'reduce_shopping_10pct') {
    const reduction = data.monthly_income * 0.10;
    modified.shopping = Math.max(0, (data.shopping || 0) - reduction);
    label = 'Reduce spending by 10%';
  } else if (scenarioType === 'reduce_rent') {
    modified.rent = Math.round((data.rent || 0) * 0.85);
    label = 'Cut rent by 15%';
  } else if (scenarioType === 'boost_savings') {
    modified.shopping = Math.max(0, (data.shopping || 0) * 0.5);
    modified.other = Math.max(0, (data.other || 0) * 0.8);
    label = 'Minimize discretionary spending';
  }
  const newMetrics = calculateFinancialScore(modified);
  const newRisk = classifyRisk(newMetrics.score);
  return { label, newScore: newMetrics.score, newRisk, newMetrics, scoreDelta: newMetrics.score - metrics.score };
}

export function generateRecommendations(data, metrics, riskLevel) {
  const recommendations = [];
  const { shopping, rent, monthly_income } = data;
  const { savingsRate, shoppingRatio, rentRatio, expenseRatio } = metrics;

  if (riskLevel === 'High Risk') {
    recommendations.push({
      priority: 'urgent',
      title: 'Create an Emergency Budget',
      description: 'Immediately categorize expenses into essential vs. non-essential. Cut non-essential spending by at least 30% this month.',
      impact: 'High',
    });
  }

  if (shoppingRatio > 10) {
    const potentialSaving = Math.round((shoppingRatio - 10) / 100 * monthly_income);
    recommendations.push({
      priority: 'high',
      title: 'Reduce Discretionary Spending',
      description: `Cutting shopping budget to 10% of income could save you an additional AED ${potentialSaving.toLocaleString()} monthly.`,
      impact: 'High',
    });
  }

  if (savingsRate < 20) {
    recommendations.push({
      priority: 'medium',
      title: 'Apply the 50/30/20 Rule',
      description: 'Allocate 50% to needs, 30% to wants, and 20% to savings. This structured approach improves stability scores by an average of 25 points.',
      impact: 'Medium',
    });
  }

  if (rentRatio > 35) {
    recommendations.push({
      priority: 'medium',
      title: 'Explore Housing Alternatives',
      description: 'Consider university dormitories or shared accommodation to reduce housing costs. A 10% reduction in rent can improve your stability score significantly.',
      impact: 'High',
    });
  }

  recommendations.push({
    priority: 'low',
    title: 'Activate UAE Student Benefits',
    description: 'Use your student ID for transport discounts (RTA), food discounts at campus canteens, and free access to financial literacy workshops at ADGM.',
    impact: 'Medium',
  });

  recommendations.push({
    priority: 'low',
    title: 'Start Micro-Investing',
    description: 'Platforms like StashAway and Sarwa offer UAE-based students low-minimum investment options. Even AED 100/month in index funds creates long-term wealth.',
    impact: 'Low',
  });

  return recommendations;
}