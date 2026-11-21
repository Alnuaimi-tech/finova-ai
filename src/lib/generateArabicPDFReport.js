import { base44 } from '@/api/base44Client';

// ── Brand palette (matches src/index.css tokens) ──
const BG = '#080c16';
const CARD = '#0e1320';
const FG = '#f1f5f9';
const MUTED = '#667b99';
const BORDER = '#1d2435';
const GOLD = '#fbbd23';
const EMERALD = '#27b07d';
const AMBER = '#f59f0a';
const ROSE = '#e21d48';

// Western digits everywhere, even inside an RTL document.
const num = (v) => Number(v || 0).toLocaleString('en-US');
const scoreColor = (s) => (s >= 70 ? EMERALD : s >= 40 ? AMBER : ROSE);

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function cardBlock(inner) {
  return `<div class="block card">${inner}</div>`;
}

function sectionTitle(text) {
  return `<div class="block section-title"><span class="rule"></span><span class="section-label">${esc(text)}</span></div>`;
}

function row(label, value, color = FG, last = false) {
  return `<div class="row${last ? ' row-last' : ''}">
    <span class="row-label">${esc(label)}</span>
    <span class="row-value" style="color:${color};" dir="ltr">${esc(value)}</span>
  </div>`;
}

function bar(pct, color) {
  const w = Math.max(2, Math.min(100, pct || 0));
  return `<div class="bar"><div class="bar-fill" style="width:${w}%;background:${color};"></div></div>`;
}

function buildBody({ data, metrics, riskLevel, insights, recommendations, holdings, t, generatedDate }) {
  const p = t.pdf;
  const score = Math.round(metrics.score);
  const sc = scoreColor(score);
  const riskText = t.dash.risk[riskLevel] || riskLevel;
  const note = score >= 70 ? p.noteStrong : score >= 40 ? p.noteMid : p.noteLow;
  const circumference = 2 * Math.PI * 40;

  const expenses = [
    [p.cats.rent, data.rent, ROSE],
    [p.cats.food, data.food, AMBER],
    [p.cats.transport, data.transport, GOLD],
    [p.cats.shopping, data.shopping, EMERALD],
    [p.cats.other, data.other, MUTED],
  ].filter(([, v]) => Number(v) > 0);

  const parts = [];

  // ── Header ──
  parts.push(`<div class="block report-header">
    <div class="brand">
      <div class="brand-mark">F</div>
      <div>
        <div class="brand-name">FINOVA <span>AI</span></div>
        <div class="muted small">${esc(p.title)}</div>
      </div>
    </div>
    <div class="header-meta">
      <div class="muted small">${esc(p.generated(generatedDate))}</div>
      <div class="muted small">${esc(p.audience)}</div>
    </div>
  </div>`);

  // ── Score ──
  parts.push(cardBlock(`<div class="score-wrap">
    <svg width="104" height="104" viewBox="0 0 104 104" class="score-ring">
      <circle cx="52" cy="52" r="40" fill="none" stroke="${BORDER}" stroke-width="8"/>
      <circle cx="52" cy="52" r="40" fill="none" stroke="${sc}" stroke-width="8" stroke-linecap="round"
        stroke-dasharray="${((score / 100) * circumference).toFixed(2)} ${circumference.toFixed(2)}"
        transform="rotate(-90 52 52)"/>
      <text x="52" y="56" text-anchor="middle" font-size="26" font-weight="700" fill="${FG}">${score}</text>
      <text x="52" y="72" text-anchor="middle" font-size="9" fill="${MUTED}">/ 100</text>
    </svg>
    <div class="score-text">
      <div class="muted small">${esc(p.scoreLabel)}</div>
      <div class="risk" style="color:${sc};">${esc(riskText)}</div>
      <div class="muted small note">${esc(note)}</div>
    </div>
  </div>`));

  // ── Summary ──
  parts.push(sectionTitle(p.summaryTitle));
  const surplus = metrics.monthlySurplus;
  parts.push(cardBlock(
    row(p.income, `AED ${num(data.monthly_income)}`, GOLD) +
    row(p.expenses, `AED ${num(metrics.totalExpenses)}`) +
    row(p.surplus, `${surplus >= 0 ? '+' : ''}AED ${num(surplus)}`, surplus >= 0 ? EMERALD : ROSE) +
    row(p.savingsRate, `${metrics.savingsRate}%`, metrics.savingsRate >= 20 ? EMERALD : FG) +
    row(p.savings, `AED ${num(data.current_savings)}`, FG, true)
  ));

  // ── Expenses ──
  if (expenses.length) {
    parts.push(sectionTitle(p.expenseTitle));
    const rows = expenses.map(([label, val, color]) => {
      const pct = data.monthly_income > 0 ? (val / data.monthly_income) * 100 : 0;
      return `<div class="expense-row">
          <span class="expense-label">${esc(label)}</span>
          <span class="expense-value" dir="ltr">AED ${num(val)} (${pct.toFixed(1)}%)</span>
        </div>${bar(pct, color)}`;
    }).join('');
    parts.push(cardBlock(rows));
  }

  // ── Insights ──
  if (insights && insights.length) {
    parts.push(sectionTitle(p.insightsTitle));
    insights.slice(0, 4).forEach((insight) => {
      parts.push(cardBlock(
        `<div class="insight">
          <div class="item-title">${esc(insight.title)}</div>
          <div class="item-body">${esc(insight.text || insight.description)}</div>
        </div>`
      ));
    });
  }

  // ── Recommendations ──
  if (recommendations && recommendations.length) {
    parts.push(sectionTitle(p.planTitle));
    recommendations.slice(0, 4).forEach((rec, i) => {
      parts.push(cardBlock(
        `<div class="rec">
          <div class="rec-num">${i + 1}</div>
          <div>
            <div class="item-title">${esc(rec.title)}</div>
            <div class="item-body">${esc(rec.action || rec.description)}</div>
          </div>
        </div>`
      ));
    });
  }

  // ── Virtual portfolio ──
  if (holdings && holdings.length) {
    parts.push(sectionTitle(p.portfolioTitle));
    const totalInvested = holdings.reduce((s, h) => s + h.purchase_price * h.quantity, 0);
    const holdingRows = holdings.map((h, i) => row(h.name, `${h.quantity} @ AED ${num(h.purchase_price)}`, FG, i === holdings.length - 1)).join('');
    parts.push(cardBlock(
      row(p.holdings, String(holdings.length)) +
      row(p.invested, `AED ${num(totalInvested)}`, GOLD) +
      `<div class="divider"></div>` +
      holdingRows
    ));
  }

  return parts.join('');
}

function buildDocument(bodyHtml, footerText) {
  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="utf-8">
<title>FINOVA AI</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 12mm 12mm 18mm; }
  * { box-sizing: border-box; }
  html, body {
    margin: 0; padding: 0;
    background: ${BG};
    color: ${FG};
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  body {
    font-family: 'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif;
    direction: rtl;
    text-align: right;
    font-size: 12px;
    line-height: 1.7;
    padding: 4mm;
  }
  .block { break-inside: avoid; page-break-inside: avoid; }
  .card {
    background: ${CARD};
    border: 1px solid ${BORDER};
    border-radius: 14px;
    padding: 16px 18px;
    margin-bottom: 12px;
  }
  .report-header {
    display: flex; align-items: center; justify-content: space-between;
    gap: 16px; padding-bottom: 14px; margin-bottom: 16px;
    border-bottom: 1px solid ${BORDER};
  }
  .brand { display: flex; align-items: center; gap: 12px; }
  .brand-mark {
    width: 44px; height: 44px; border-radius: 50%;
    border: 4px solid ${GOLD};
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; font-weight: 700; color: ${FG};
  }
  .brand-name { font-size: 19px; font-weight: 700; letter-spacing: .02em; }
  .brand-name span { color: ${GOLD}; }
  .header-meta { text-align: left; line-height: 1.9; }
  .small { font-size: 11px; }
  .muted { color: ${MUTED}; }
  .score-wrap { display: flex; align-items: center; gap: 18px; }
  .score-ring { flex: 0 0 auto; }
  .score-text { flex: 1; }
  .risk { font-size: 19px; font-weight: 700; margin: 4px 0 6px; }
  .note { line-height: 1.9; }
  .section-title { display: flex; align-items: center; gap: 8px; margin: 10px 0 8px; }
  .rule { display: inline-block; width: 22px; height: 3px; border-radius: 2px; background: ${GOLD}; }
  .section-label { font-size: 12px; font-weight: 700; color: ${GOLD}; }
  .row {
    display: flex; justify-content: space-between; align-items: baseline;
    gap: 12px; padding: 6px 0; border-bottom: 1px solid ${BORDER};
  }
  .row-last { border-bottom: none; }
  .row-label { font-size: 12px; color: ${MUTED}; }
  .row-value { font-size: 12px; font-weight: 700; }
  .divider { border-top: 1px solid ${BORDER}; margin: 6px 0; }
  .expense-row { display: flex; justify-content: space-between; align-items: baseline; padding-top: 4px; }
  .expense-label { font-size: 12px; color: ${FG}; }
  .expense-value { font-size: 12px; font-weight: 700; color: ${MUTED}; }
  .bar { height: 6px; border-radius: 4px; background: ${BORDER}; margin: 3px 0 9px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 4px; }
  .insight { border-right: 3px solid ${GOLD}; padding-right: 12px; }
  .rec { display: flex; gap: 10px; }
  .rec-num {
    width: 22px; height: 22px; border-radius: 50%; flex: 0 0 auto;
    background: ${GOLD}; color: ${BG};
    font-size: 11px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
  }
  .item-title { font-size: 12.5px; font-weight: 700; color: ${FG}; margin-bottom: 3px; }
  .item-body { font-size: 11.5px; color: ${MUTED}; line-height: 1.9; }
  .report-footer {
    position: fixed; bottom: 0; right: 0; left: 0;
    padding-top: 6px; border-top: 1px solid ${BORDER};
    font-size: 10px; color: ${MUTED}; text-align: center;
  }
</style>
</head>
<body>
  ${bodyHtml}
  <div class="report-footer">${esc(footerText)}</div>
</body>
</html>`;
}

export async function generateArabicPDFReport({ data, metrics, riskLevel, insights, recommendations, t }) {
  let holdings = [];
  try {
    holdings = await base44.entities.VirtualHolding.list();
  } catch (_) { /* portfolio section is optional */ }

  const generatedDate = new Date().toLocaleDateString('ar-AE-u-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' });
  const body = buildBody({ data, metrics, riskLevel, insights, recommendations, holdings, t, generatedDate });
  const html = buildDocument(body, t.pdf.footer);

  // The browser's own print engine shapes and orders Arabic correctly, so the report is
  // laid out as an RTL page and printed (Save as PDF) rather than drawn onto a canvas.
  const frame = document.createElement('iframe');
  frame.setAttribute('aria-hidden', 'true');
  frame.style.cssText = 'position:fixed;left:-10000px;top:0;width:0;height:0;border:0;';
  document.body.appendChild(frame);

  const cleanup = () => { if (frame.parentNode) frame.parentNode.removeChild(frame); };

  try {
    const doc = frame.contentDocument;
    doc.open();
    doc.write(html);
    doc.close();

    // Wait for the Arabic webfont, otherwise the print preview falls back to a system face.
    if (doc.fonts) {
      try {
        await doc.fonts.load('400 16px "Noto Sans Arabic"');
        await doc.fonts.load('700 16px "Noto Sans Arabic"');
        await doc.fonts.ready;
      } catch (_) { /* fall back to whatever the browser has */ }
    }
    await new Promise((resolve) => setTimeout(resolve, 250));

    const win = frame.contentWindow;
    win.focus();
    win.print();
    setTimeout(cleanup, 120000);
  } catch (err) {
    cleanup();
    // Some mobile browsers cannot print a frame — hand the report to a new tab instead.
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
    window.open(url, '_blank');
  }
}