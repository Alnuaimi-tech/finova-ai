import { useState } from 'react';
import { base44 } from '@/api/base44Client';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setStatus('sending');
    try {
      await base44.entities.ContactMessage.create(form);
      setForm({ name: '', email: '', message: '' });
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={submit} className="glass-card rounded-3xl border border-border p-6 md:p-8 space-y-5">
      {[['name', 'Name', 'Your name'], ['email', 'Email', 'you@example.com']].map(([key, label, placeholder]) => (
        <label key={key} className="block text-sm font-medium text-foreground">{label}
          <input required type={key === 'email' ? 'email' : 'text'} maxLength={key === 'name' ? 100 : 200} value={form[key]} onChange={(e) => update(key, e.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/60" />
        </label>
      ))}
      <label className="block text-sm font-medium text-foreground">Message
        <textarea required maxLength={2000} rows={6} value={form.message} onChange={(e) => update('message', e.target.value)} placeholder="How can we help?" className="mt-2 w-full resize-none rounded-xl border border-border bg-secondary/40 px-4 py-3 text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/60" />
      </label>
      <button disabled={status === 'sending'} className="w-full gold-gradient text-primary-foreground rounded-xl py-3 font-space font-bold disabled:opacity-60">{status === 'sending' ? 'Sending…' : 'Send message'}</button>
      {status === 'sent' && <p className="text-sm text-emerald-400">Thanks—your message has been received.</p>}
      {status === 'error' && <p className="text-sm text-rose-400">Your message could not be sent. Please try again.</p>}
    </form>
  );
}