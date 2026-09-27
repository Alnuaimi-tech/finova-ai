import jsPDF from 'jspdf';
import { base44 } from '@/api/base44Client';

// ── Brand palette (pulled from src/index.css tokens) ──
const BG = [8, 12, 22];
const CARD = [14, 19, 32];
const FG = [241, 245, 249];
const MUTED = [102, 123, 153];
const BORDER = [29, 36, 53];
const GOLD = [251, 189, 35];
const GOLD_LO = [220, 143, 9];
const EMERALD = [39, 176, 125];
const AMBER = [245, 159, 10];
const ROSE = [226, 29, 72];

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 14;
const CONTENT_W = PAGE_W - MARGIN * 2;

function fillPageBg(doc) {
  doc.setFillColor(...BG);
  doc.rect(0, 0, PAGE_W, PAGE_H, 'F');
}

function polar(cx, cy, r, deg) {
  const rad = (deg * Math.PI) / 180;
  return [cx + r * Math.sin(rad), cy - r * Math.cos(rad)];
}

function drawRingArc(doc, cx, cy, r, lineWidth, fromDeg, toDeg, color) {
  if (toDeg <= fromDeg) return;
  doc.setDrawColor(...color);
  doc.setLineWidth(lineWidth);
  if (doc.setLineCap) doc.setLineCap('round');
  const steps = Math.max(2, Math.ceil((toDeg - fromDeg) / 3));
  let prev = null;
  for (let i = 0; i <= steps; i++) {
    const deg = fromDeg + ((toDeg - fromDeg) * i) / steps;
    const pt = polar(cx, cy, r, deg);
    if (prev) doc.line(prev[0], prev[1], pt[0], pt[1]);
    prev = pt;
  }
}

function scoreColorFor(score) {
  if (score >= 70) return EMERALD;
  if (score >= 40) return AMBER;
  return ROSE;
}

function card(doc, x, y, w, h) {
  doc.setFillColor(...CARD);
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.3);
  doc.roundedRect(x, y, w, h, 3, 3, 'FD');
}

function ringLogo(doc, cx, cy, r) {
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(r * 0.16);
  doc.circle(cx, cy, r, 'S');
  doc.setFont('times', 'bold');
  doc.setFontSize(r * 1.7);
  doc.setTextColor(...FG);
  doc.text('F', cx, cy + r * 0.35, { align: 'center' });
}

function sectionTitle(doc, title, y) {
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.6);
  doc.line(MARGIN, y, MARGIN + 6, y);
  doc.setFontSize(10.5);
  doc.setTextColor(...GOLD);
  doc.setFont('helvetica', 'bold');
  doc.text(title.toUpperCase(), MARGIN + 9, y + 1.2);
  return y + 9;
}

function row(doc, x, w, label, value, y, opts = {}) {
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...MUTED);
  doc.text(String(label), x, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...(opts.color || FG));
  doc.text(String(value), x + w, y, { align: 'right' });
  return y + 7.2;
}

function barIndicator(doc, x, w, y, pct, color) {
  const h = 1.6;
  doc.setFillColor(...BORDER);
  doc.roundedRect(x, y, w, h, 0.8, 0.8, 'F');
  const fillW = Math.max(h, (Math.min(pct, 100) / 100) * w);
  doc.setFillColor(...color);
  doc.roundedRect(x, y, fillW, h, 0.8, 0.8, 'F');
  return y + h + 4.5;
}

function heroHeader(doc, generatedDate) {
  doc.setFillColor(...CARD);
  doc.rect(0, 0, PAGE_W, 40, 'F');
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.3);
  doc.line(0, 40, PAGE_W, 40);

  ringLogo(doc, MARGIN + 9, 20, 8);

  doc.setFont('times', 'bold');
  doc.setFontSize(19);
  doc.setTextColor(...FG);
  doc.text('FINOVA', MARGIN + 24, 17.5);
  doc.setTextColor(...GOLD);
  const finovaWidth = doc.getTextWidth('FINOVA ');
  doc.text('AI', MARGIN + 24 + finovaWidth, 17.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...MUTED);
  doc.text('Financial Progress Report', MARGIN + 24, 24);
  doc.text(`Generated ${generatedDate}`, MARGIN + 24, 29.5);

  doc.setFontSize(7.5);
  doc.setTextColor(...MUTED);
  doc.text('UAE Students & Young Adults', PAGE_W - MARGIN, 24, { align: 'right' });
}

function continuationHeader(doc) {
  doc.setFillColor(...CARD);
  doc.rect(0, 0, PAGE_W, 16, 'F');
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.2);
  doc.line(0, 16, PAGE_W, 16);
  ringLogo(doc, MARGIN + 3.2, 8, 2.8);
  doc.setFont('times', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...FG);
  doc.text('FINOVA AI', MARGIN + 9, 9.3);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  doc.text('Financial Progress Report', PAGE_W - MARGIN, 9.3, { align: 'right' });
}

function newPage(doc) {
  doc.addPage();
  fillPageBg(doc);
  continuationHeader(doc);
  return 26;
}

function ensureSpace(doc, y, needed, limit = 268) {
  if (y + needed > limit) return newPage(doc);
  return y;
}

export async function generatePDFReport({ data, metrics, riskLevel, insights, recommendations }) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  fillPageBg(doc);

  const generatedDate = new Date().toLocaleDateString('en-AE', { day: 'numeric', month: 'long', year: 'numeric' });
  heroHeader(doc, generatedDate);

  let y = 50;

  // ── Score hero card ──
  const scoreCardH = 40;
  card(doc, MARGIN, y, CONTENT_W, scoreCardH);
  const sColor = scoreColorFor(metrics.score);
  const ringCx = MARGIN + 26;
  const ringCy = y + scoreCardH / 2;
  const outerR = 15.5;
  const ringW = 3.4;
  drawRingArc(doc, ringCx, ringCy, outerR, ringW, 0, 360, BORDER);
  drawRingArc(doc, ringCx, ringCy, outerR, ringW, 0, (metrics.score / 100) * 360, sColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(19);
  doc.setTextColor(...FG);
  doc.text(String(metrics.score), ringCx, ringCy + 2, { align: 'center' });
  doc.setFontSize(6.5);
  doc.setTextColor(...MUTED);
  doc.text('/ 100', ringCx, ringCy + 7.5, { align: 'center' });

  const infoX = MARGIN + 52;
  doc.setFontSize(8.5);
  doc.setTextColor(...MUTED);
  doc.setFont('helvetica', 'normal');
  doc.text('FINANCIAL STABILITY SCORE', infoX, y + 13);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...sColor);
  doc.text(riskLevel, infoX, y + 23);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...MUTED);
  const scoreNote = metrics.score >= 70
    ? 'Strong habits — savings and spending are well balanced.'
    : metrics.score >= 40
      ? 'Room to improve — a few changes will move this up.'
      : 'Needs attention — start with the action plan below.';
  const noteLines = doc.splitTextToSize(scoreNote, CONTENT_W - 52 - 12);
  doc.text(noteLines, infoX, y + 30);

  y += scoreCardH + 8;

  // ── Financial Summary ──
  y = sectionTitle(doc, 'Financial Summary', y);
  const summaryCardH = 44;
  card(doc, MARGIN, y, CONTENT_W, summaryCardH);
  let ry = y + 8;
  const px = MARGIN + 6;
  const pw = CONTENT_W - 12;
  ry = row(doc, px, pw, 'Monthly Income', `AED ${data.monthly_income.toLocaleString()}`, ry, { color: GOLD });
  ry = row(doc, px, pw, 'Total Monthly Expenses', `AED ${metrics.totalExpenses.toLocaleString()}`, ry);
  ry = row(doc, px, pw, 'Monthly Surplus', `${metrics.monthlySurplus >= 0 ? '+' : ''}AED ${metrics.monthlySurplus.toLocaleString()}`, ry, { color: metrics.monthlySurplus >= 0 ? EMERALD : ROSE });
  ry = row(doc, px, pw, 'Savings Rate', `${metrics.savingsRate}%`, ry, { color: metrics.savingsRate >= 20 ? EMERALD : FG });
  ry = row(doc, px, pw, 'Current Savings', `AED ${(data.current_savings || 0).toLocaleString()}`, ry);
  y += summaryCardH + 8;

  // ── Expense Breakdown ──
  const expenses = [
    ['Rent', data.rent, ROSE],
    ['Food', data.food, AMBER],
    ['Transport', data.transport, GOLD],
    ['Shopping', data.shopping, EMERALD],
    ['Other', data.other, MUTED],
  ].filter(([, v]) => v > 0);

  if (expenses.length) {
    y = sectionTitle(doc, 'Expense Breakdown', y);
    const expCardH = expenses.length * 11.5 + 6;
    y = ensureSpace(doc, y, expCardH + 4);
    card(doc, MARGIN, y, CONTENT_W, expCardH);
    let ey = y + 7;
    expenses.forEach(([label, val, color]) => {
      const pct = data.monthly_income > 0 ? (val / data.monthly_income) * 100 : 0;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...FG);
      doc.text(label, MARGIN + 6, ey);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...MUTED);
      doc.text(`AED ${val.toLocaleString()} (${pct.toFixed(1)}%)`, PAGE_W - MARGIN - 6, ey, { align: 'right' });
      ey += 3.5;
      ey = barIndicator(doc, MARGIN + 6, CONTENT_W - 12, ey, pct, color) + 4;
    });
    y += expCardH + 8;
  }

  // ── AI Insights ──
  if (insights?.length) {
    y = ensureSpace(doc, y, 14);
    y = sectionTitle(doc, 'AI Insights', y);
    insights.slice(0, 4).forEach((insight) => {
      const text = insight.text || insight.description || '';
      const lines = doc.splitTextToSize(text, CONTENT_W - 14).slice(0, 2);
      const blockH = 6 + lines.length * 4.3 + 4;
      y = ensureSpace(doc, y, blockH);
      doc.setFillColor(...GOLD);
      doc.roundedRect(MARGIN, y - 3.2, 1.3, blockH - 3, 0.6, 0.6, 'F');
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...FG);
      doc.text(insight.title || '', MARGIN + 5, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.3);
      doc.setTextColor(...MUTED);
      lines.forEach((line) => { doc.text(line, MARGIN + 5, y); y += 4.3; });
      y += 3;
    });
  }

  // ── Recommendations ──
  if (recommendations?.length) {
    y = ensureSpace(doc, y, 14);
    y = sectionTitle(doc, 'AI Action Plan', y);
    recommendations.slice(0, 4).forEach((rec, i) => {
      const text = rec.action || rec.description || '';
      const lines = doc.splitTextToSize(text, CONTENT_W - 16).slice(0, 2);
      const blockH = 6 + lines.length * 4.3 + 4;
      y = ensureSpace(doc, y, blockH);
      doc.setFillColor(...GOLD);
      doc.circle(MARGIN + 2.6, y - 1.4, 2.6, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...BG);
      doc.text(String(i + 1), MARGIN + 2.6, y - 0.6, { align: 'center' });
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...FG);
      doc.text(rec.title || '', MARGIN + 8, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.3);
      doc.setTextColor(...MUTED);
      lines.forEach((line) => { doc.text(line, MARGIN + 8, y); y += 4.3; });
      y += 3;
    });
  }

  // ── Virtual Portfolio ──
  let holdings = [];
  try {
    holdings = await base44.entities.VirtualHolding.list();
  } catch (_) {}

  if (holdings.length > 0) {
    y = ensureSpace(doc, y, 20);
    y = sectionTitle(doc, 'Virtual Portfolio', y);
    const totalInvested = holdings.reduce((s, h) => s + h.purchase_price * h.quantity, 0);
    const portCardH = 16 + holdings.length * 7;
    y = ensureSpace(doc, y, portCardH);
    card(doc, MARGIN, y, CONTENT_W, portCardH);
    let py = y + 8;
    py = row(doc, MARGIN + 6, CONTENT_W - 12, 'Total Holdings', holdings.length, py);
    py = row(doc, MARGIN + 6, CONTENT_W - 12, 'Total Invested (Virtual)', `AED ${totalInvested.toFixed(2)}`, py, { color: GOLD });
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.2);
    doc.line(MARGIN + 6, py - 3, PAGE_W - MARGIN - 6, py - 3);
    py += 1.5;
    holdings.forEach((h) => {
      py = row(doc, MARGIN + 6, CONTENT_W - 12, h.name, `${h.quantity} @ AED ${h.purchase_price}`, py);
    });
    y += portCardH + 8;
  }

  // ── Footer on every page ──
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.2);
    doc.line(0, PAGE_H - 12, PAGE_W, PAGE_H - 12);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...MUTED);
    doc.text('FINOVA AI · Educational Report · Not Financial Advice · For UAE Students', MARGIN, PAGE_H - 6.5);
    doc.text(`Page ${i} of ${pageCount}`, PAGE_W - MARGIN, PAGE_H - 6.5, { align: 'right' });
  }

  doc.save(`FINOVA_Report_${new Date().toISOString().split('T')[0]}.pdf`);
}
