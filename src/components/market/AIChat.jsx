import { useState, useRef, useEffect } from 'react';
import { Brain, Send, Loader2, MessageCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ReactMarkdown from 'react-markdown';

const SUGGESTED = [
  'What is a good beginner stock in the UAE?',
  'Explain dividend investing simply',
  'Is Bitcoin safe to invest in?',
  'How do I read a stock chart?',
];

export default function AIChat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your FINOVA AI financial assistant. I can explain stocks, help you understand UAE markets, and give you educational investment guidance. What would you like to learn today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function send(text) {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);

    try {
      const response = await base44.functions.invoke('askFinanceQuestion', {
        question: msg,
        history: messages.slice(-6),
      });
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'I could not answer that right now. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-card rounded-2xl border border-border flex flex-col h-[380px] md:h-[480px]">
      {/* Header */}
      <div className="flex items-center gap-2.5 p-4 border-b border-border">
        <div className="w-7 h-7 gold-gradient rounded-lg flex items-center justify-center">
          <Brain className="w-3.5 h-3.5 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">FINOVA AI Assistant</p>
          <p className="text-xs text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'assistant' && (
              <div className="w-6 h-6 rounded-lg gold-gradient flex items-center justify-center flex-shrink-0 mt-0.5">
                <Brain className="w-3 h-3 text-primary-foreground" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${m.role === 'user' ? 'bg-primary/10 border border-primary/20 text-foreground' : 'glass-card border border-border text-foreground'}`}>
              <ReactMarkdown>{m.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2.5">
            <div className="w-6 h-6 rounded-lg gold-gradient flex items-center justify-center flex-shrink-0">
              <Brain className="w-3 h-3 text-primary-foreground" />
            </div>
            <div className="glass-card border border-border rounded-2xl px-3.5 py-2.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {SUGGESTED.map((s, i) => (
            <button key={i} onClick={() => send(s)}
              className="text-xs px-3 py-1.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-border flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !loading && send()}
          placeholder="Ask about stocks, investing, UAE markets…"
          className="flex-1 bg-secondary/40 border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/40 transition-all"
        />
        <button onClick={() => send()} disabled={loading || !input.trim()}
          className="gold-gradient text-primary-foreground p-2 rounded-xl disabled:opacity-40 transition-opacity">
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}