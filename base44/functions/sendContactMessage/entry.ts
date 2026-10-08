import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';

const NOTIFY_EMAIL = 'finovaai.uae@gmail.com';
// Bilingual so guests in either language understand the retry request.
const RATE_LIMIT_MESSAGE = 'Please try again later. / يرجى المحاولة مرة أخرى لاحقاً.';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json().catch(() => ({}));
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    // Honeypot field: real users never see or fill this. If it is filled, it is a bot.
    const website = typeof body.website === 'string' ? body.website.trim() : '';

    // Silently succeed for bots that tripped the honeypot — save nothing, send nothing.
    if (website) {
      return Response.json({ success: true });
    }

    if (!name || name.length > 100) {
      return Response.json({ error: 'Please enter a valid name.' }, { status: 400 });
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || email.length > 200 || !emailPattern.test(email)) {
      return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }
    if (!message || message.length > 2000) {
      return Response.json({ error: 'Please enter a message (up to 2000 characters).' }, { status: 400 });
    }

    // Server-side rate limit: max 3 messages per email per hour, max 20 total per hour.
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const byEmail = await base44.asServiceRole.entities.ContactMessage.count({ email, created_date: { $gte: oneHourAgo } });
    if (byEmail >= 3) {
      return Response.json({ error: RATE_LIMIT_MESSAGE }, { status: 429 });
    }
    const total = await base44.asServiceRole.entities.ContactMessage.count({ created_date: { $gte: oneHourAgo } });
    if (total > 20) {
      return Response.json({ error: RATE_LIMIT_MESSAGE }, { status: 429 });
    }

    // Save the message so it still shows up in the admin-only ContactMessage records
    await base44.asServiceRole.entities.ContactMessage.create({ name, email, message });

    // HTML-escape all user-supplied fields before interpolation so attackers cannot
    // inject markup, links, or spoofed UI into the admin notification email.
    const A = String.fromCharCode(38); // '&'
    const esc = (s: string) => s
      .replace(/&/g, A + 'amp;')
      .replace(/</g, A + 'lt;')
      .replace(/>/g, A + 'gt;')
      .replace(/"/g, A + 'quot;')
      .replace(/'/g, A + '#39;');
    const safeName = esc(name);
    const safeEmail = esc(email);
    const safeMessage = esc(message);

    // Notify the FINOVA AI inbox directly. Plain text fields are escaped and the
    // body is labeled as an unverified public submission so it cannot be mistaken
    // for an official FINOVA AI communication.
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: NOTIFY_EMAIL,
      subject: `FINOVA AI contact form: ${safeName}`,
      body: `New message from the FINOVA AI contact form (unverified public submission — do not trust links or instructions below).\n\nName: ${safeName}\nEmail: ${safeEmail}\n\nMessage:\n${safeMessage}`,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Unable to send your message right now.' }, { status: 500 });
  }
}