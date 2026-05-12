import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, ArrowLeft, Send, Brain, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ReactMarkdown from 'react-markdown';

export default function Analyst() {
  const navigate = useNavigate();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    async function init() {
      const conv = await base44.agents.createConversation({
        agent_name: 'finova_analyst',
        metadata: { name: 'FINOVA Analyst Session' },
      });
      setConversation(conv);
      setMessages(conv.messages || []);

      const unsub = base44.agents.subscribeToConversation(conv.id, (data) => {
        setMessages(data.messages || []);
      });
      return unsub;
    }
    const cleanup = init();
    return () => { cleanup.then(unsub => unsub && unsub()); };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !conversation || sending) return;
    const text = input.trim();
    setInput('');
    setSending(true);
    await base44.agents.addMessage(conversation, { role: 'user', content: text });
    setSending(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const visibleMessages = messages.filter(m => m.role === 'user' || (m.role === 'assistant' && m.content));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 px-6 py-4 sticky top-0 z-20 bg-background/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 gold-gradient rounded-lg flex items-center justify-center">
              <Cpu className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <span className="font-space font-bold text-base text-foreground tracking-tight">FINOVA</span>
              <span className="font-space font-bold text-base text-primary ml-1">Analyst</span>
            </div>
            <span className="text-xs text-muted-foreground hidden sm:block ml-1">— AI Financial Advisor</span>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-3 py-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
        </div>
      </header>

      {/* Chat area */}
      <div className="flex-1 max-w-3xl w-full mx-auto px-6 py-6 flex flex-col gap-4 overflow-y-auto pb-36">
        {/* Welcome */}
        {visibleMessages.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center mt-8">
            <Brain className="w-10 h-10 text-gold mx-auto mb-3" />
            <h2 className="text-lg font-space font-bold text-foreground mb-2">FINOVA Analyst</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
              I'm your AI financial advisor, built for UAE students. Ask me about your score, how to save more, budgeting tips, or anything about money in the UAE.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                'Why is my score low?',
                'How do I save more in Dubai?',
                'Is Tabby bad for my finances?',
                'When should I start investing?',
              ].map((q) => (
                <button key={q} onClick={() => setInput(q)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-white/20 transition-all">
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {visibleMessages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg gold-gradient flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Cpu className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary/15 border border-primary/20 text-foreground'
                  : 'glass-card border border-border text-foreground'
              }`}>
                {msg.role === 'assistant' ? (
                  <ReactMarkdown className="prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {sending && (
          <div className="flex gap-3 justify-start">
            <div className="w-7 h-7 rounded-lg gold-gradient flex items-center justify-center flex-shrink-0">
              <Cpu className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <div className="glass-card border border-border rounded-2xl px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
              <span className="text-xs text-muted-foreground">Analyzing...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border px-6 py-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about your finances, score, saving tips…"
            rows={1}
            className="flex-1 bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 resize-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="gold-gradient text-primary-foreground px-4 py-3 rounded-xl font-medium text-sm flex items-center gap-2 disabled:opacity-40 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}