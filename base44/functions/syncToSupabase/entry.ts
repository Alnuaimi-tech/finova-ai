import { secrets } from 'base44:runtime';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';

// Copies FINOVA AI data into the private `base44` schema of the FINOVA AI Supabase project.
// Runs on a schedule (SyncToSupabase workflow) and can be triggered manually by an admin.
const SYNC_URL = 'https://xhrmkqjgsktgyikghepz.supabase.co/functions/v1/base44-sync';
const OVERLAP_MS = 60 * 60 * 1000; // re-send the last hour of events so nothing is missed between runs

// Base44 returns some timestamps without a timezone; they are UTC.
const ts = (v) => (!v ? null : /([zZ]|[+-]\d\d:?\d\d)$/.test(v) ? v : `${v}Z`);
const num = (v) => (v == null || v === '' || !Number.isFinite(Number(v)) ? null : Number(v));

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const token = secrets.get('SUPABASE_SYNC_TOKEN');
    if (!token) return Response.json({ error: 'Sync is not configured' }, { status: 500 });

    const post = async (body) => {
      const res = await fetch(SYNC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-sync-token': token },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(30000),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(`Supabase sync failed (${res.status}): ${data.error || 'unknown error'}`);
      return data;
    };

    // 1. Ask Supabase for the newest event it already has
    const status = await post({ action: 'status' });
    const since = status.last_event ? Date.parse(status.last_event) - OVERLAP_MS : 0;

    // 2. Read everything from Base44
    const db = base44.asServiceRole.entities;
    const [users, events, profiles, contacts, holdings, caches] = await Promise.all([
      db.User.list('-created_date', 5000),
      db.AppEvent.list('-created_date', 5000),
      db.FinancialProfile.list('-created_date', 5000),
      db.ContactMessage.list('-created_date', 5000),
      db.VirtualHolding.list('-created_date', 5000),
      db.MarketDataCache.list('-created_date', 100),
    ]);

    const tables = {
      users: users.map((u) => ({
        id: u.id, email: u.email ?? null, full_name: u.full_name ?? null, role: u.role ?? null,
        is_verified: typeof u.is_verified === 'boolean' ? u.is_verified : null,
        created_at: ts(u.created_date), updated_at: ts(u.updated_date),
      })),
      app_events: events
        .filter((e) => !since || Date.parse(ts(e.created_date)) >= since)
        .map((e) => ({
          id: e.id, event_type: e.event_type ?? null, user_email: e.user_email ?? null,
          user_name: e.user_name ?? null, session_id: e.session_id ?? null,
          created_by: e.created_by ?? null, created_at: ts(e.created_date),
        })),
      financial_profiles: profiles.map((p) => ({
        id: p.id, created_by: p.created_by ?? null, profession: p.profession ?? null,
        monthly_income: num(p.monthly_income), rent: num(p.rent), food: num(p.food),
        transport: num(p.transport), shopping: num(p.shopping), other: num(p.other),
        current_savings: num(p.current_savings), stability_score: num(p.stability_score),
        risk_level: p.risk_level ?? null, ai_analysis: p.ai_analysis ?? null,
        prediction_summary: p.prediction_summary ?? null, created_at: ts(p.created_date),
      })),
      contact_messages: contacts.map((c) => ({
        id: c.id, name: c.name ?? null, email: c.email ?? null, message: c.message ?? null,
        created_at: ts(c.created_date),
      })),
      virtual_holdings: holdings.map((h) => ({
        id: h.id, created_by: h.created_by ?? null, ticker: h.ticker ?? null, name: h.name ?? null,
        exchange: h.exchange ?? null, quantity: num(h.quantity), purchase_price: num(h.purchase_price),
        purchase_date: h.purchase_date || null, sector: h.sector ?? null, emoji: h.emoji ?? null,
        created_at: ts(h.created_date),
      })),
      market_data_cache: caches.map((m) => ({
        id: m.id, key: m.key ?? null, budget_day: m.budget_day ?? null,
        credits_used: num(m.credits_used), message: m.message ?? null,
        created_at: ts(m.created_date), updated_at: ts(m.updated_date),
      })),
    };

    // 3. Send it. `full: true` lets Supabase drop rows that were deleted in Base44 (except events).
    const result = await post({ action: 'upsert', full: true, tables });
    return Response.json({ success: true, received: result.received, removed: result.removed });
  } catch (error) {
    console.error('syncToSupabase failed', error);
    return Response.json({ error: error instanceof Error ? error.message : 'Sync failed' }, { status: 500 });
  }
}
