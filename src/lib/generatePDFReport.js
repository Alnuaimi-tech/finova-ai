import jsPDF from 'jspdf';
import { base44 } from '@/api/base44Client';

function section(doc, title, y) {
  doc.setFillColor(245, 196, 65);
  doc.rect(14, y, 182, 0.5, 'F');
  doc.setFontSize(11);
  doc.setTextColor(245, 196, 65);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 14, y + 6);
  return y + 12;
}

function row(doc, label, value, y, highlight = false) {
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(150, 160, 180);
  doc.text(label, 14, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(highlight ? 245 : 220, highlight ? 196 : 230, highlight ? 65 : 240);
  doc.text(String(value), 110, y, { align: 'right' });
  return y + 7;
}

export async function generatePDFReport({ data, metrics, riskLevel, insights, recommendations }) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = 210;
  let y = 0;

  // ── Header background ──
  doc.setFillColor(10, 14, 26);
  doc.rect(0, 0, pageW, 40, 'F');

  // Logo area
  doc.setFillColor(245, 196, 65);
  doc.roundedRect(14, 8, 22, 22, 3, 3, 'F');
  doc.setTextColor(10, 14, 26);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('F', 25, 22, { align: 'center' });

  doc.setTextColor(245, 196, 65);
  doc.setFontSize(18);
  doc.text('FINOVA AI', 42, 18);
  doc.setFontSize(8);
  doc.setTextColor(150, 160, 180);
  doc.text('Financial Progress Report', 42, 25);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-AE', { day: 'numeric', month: 'long', year: 'numeric' })}`, 42, 31);

  y = 50;

  // ── Financial Stability Score ──
  y = section(doc, 'FINANCIAL STABILITY SCORE', y);
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  const scoreColor = metrics.score >= 70 ? [16, 185, 129] : metrics.score >= 40 ? [245, 158, 11] : [244, 63, 94];
  doc.setTextColor(...scoreColor);
  doc.text(String(metrics.score), 60, y + 10, { align: 'center' });
  doc.setFontSize(10);
  doc.setTextColor(150, 160, 180);
  doc.text('/ 100', 75, y + 10);
  doc.setFontSize(10);
  doc.setTextColor(...scoreColor);
  doc.setFont('helvetica', 'bold');
  doc.text(riskLevel, 120, y + 10);
  y += 22;

  // ── Financial Summary ──
  y = section(doc, 'FINANCIAL SUMMARY', y);
  y = row(doc, 'Monthly Income', `AED ${data.monthly_income.toLocaleString()}`, y, true);
  y = row(doc, 'Total Monthly Expenses', `AED ${metrics.totalExpenses.toLocaleString()}`, y);
  y = row(doc, 'Monthly Surplus', `${metrics.monthlySurplus >= 0 ? '+' : ''}AED ${metrics.monthlySurplus.toLocaleString()}`, y, metrics.monthlySurplus >= 0);
  y = row(doc, 'Savings Rate', `${metrics.savingsRate}%`, y, metrics.savingsRate >= 20);
  y = row(doc, 'Current Savings', `AED ${(data.current_savings || 0).toLocaleString()}`, y);
  y += 4;

  // ── Expense Breakdown ──
  y = section(doc, 'EXPENSE BREAKDOWN', y);
  const expenses = [
    ['Rent', data.rent],
    ['Food', data.food],
    ['Transport', data.transport],
    ['Shopping', data.shopping],
    ['Other', data.other],
  ].filter(([, v]) => v > 0);
  expenses.forEach(([label, val]) => {
    const pct = data.monthly_income > 0 ? ((val / data.monthly_income) * 100).toFixed(1) : 0;
    y = row(doc, label, `AED ${val.toLocaleString()} (${pct}%)`, y);
  });
  y += 4;

  // ── AI Insights ──
  y = section(doc, 'AI INSIGHTS', y);
  insights.slice(0, 4).forEach(insight => {
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(220, 230, 240);
    doc.text(`• ${insight.title}`, 14, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(130, 145, 165);
    const lines = doc.splitTextToSize(insight.text || insight.description || '', 175);
    lines.slice(0, 2).forEach(line => {
      doc.text(line, 18, y);
      y += 4.5;
    });
    y += 1;
    if (y > 250) { doc.addPage(); y = 20; }
  });
  y += 2;

  // ── Recommendations ──
  if (y > 220) { doc.addPage(); y = 20; }
  y = section(doc, 'AI ACTION PLAN', y);
  recommendations.slice(0, 4).forEach((rec, i) => {
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(245, 196, 65);
    doc.text(`${i + 1}. ${rec.title}`, 14, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(130, 145, 165);
    const lines = doc.splitTextToSize(rec.action || rec.description || '', 175);
    lines.slice(0, 2).forEach(line => {
      doc.text(line, 18, y);
      y += 4.5;
    });
    y += 1;
    if (y > 250) { doc.addPage(); y = 20; }
  });

  // ── Virtual Portfolio ──
  let holdings = [];
  try {
    holdings = await base44.entities.VirtualHolding.list();
  } catch (_) {}

  if (holdings.length > 0) {
    if (y > 200) { doc.addPage(); y = 20; }
    y = section(doc, 'VIRTUAL PORTFOLIO', y);
    const totalInvested = holdings.reduce((s, h) => s + h.purchase_price * h.quantity, 0);
    y = row(doc, 'Total Holdings', holdings.length, y);
    y = row(doc, 'Total Invested (Virtual)', `AED ${totalInvested.toFixed(2)}`, y, true);
    y += 3;
    holdings.forEach(h => {
      y = row(doc, `${h.emoji || '📈'} ${h.name}`, `${h.quantity} shares @ AED ${h.purchase_price}`, y);
      if (y > 265) { doc.addPage(); y = 20; }
    });
  }

  // ── Footer ──
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFillColor(10, 14, 26);
    doc.rect(0, 285, pageW, 12, 'F');
    doc.setFontSize(7);
    doc.setTextColor(80, 90, 110);
    doc.text('FINOVA AI · Educational Report · Not Financial Advice · For UAE Students', 105, 291, { align: 'center' });
    doc.text(`Page ${i} of ${pageCount}`, 196, 291, { align: 'right' });
  }

  doc.save(`FINOVA_Report_${new Date().toISOString().split('T')[0]}.pdf`);
}