import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Send,
  RotateCcw,
  Copy,
  Check,
  Phone,
  Mail,
  MapPin,
  Clock,
  Shield,
  HelpCircle,
  Layers,
  ArrowRight,
  Code2,
  Share2,
  Video,
  PenTool,
} from 'lucide-react';
import { AGENCY_INFO } from '../data/agencyData';
import { MarkdownContent } from '../components/chat/MarkdownContent';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  retrievedChunks?: { id: string; title: string; category: string }[];
  mode?: 'gemini' | 'rule_fallback';
}

const CATEGORY_PROMPTS = [
  {
    category: 'Confirmed Services',
    icon: Layers,
    prompts: [
      'What services does Digital Dude offer?',
      'Can you build an e-commerce store?',
      'Do you do mobile app development?',
      'Can you design logos and social media creatives?',
    ],
  },
  {
    category: 'Pricing & Hours',
    icon: Clock,
    prompts: [
      'How much does a website cost?',
      'What are your working hours?',
      'Do you offer 24/7 customer support?',
      'What is the pricing for social media marketing?',
    ],
  },
  {
    category: 'Reels & Video',
    icon: Video,
    prompts: [
      'How many reels do you create per month?',
      'Can you handle videography and video editing?',
      'Do you create short-form reels for Instagram?',
      'Can you help with influencer marketing?',
    ],
  },
  {
    category: 'Tanglish / தமிழ்',
    icon: Sparkles,
    prompts: [
      'Website panna mudiyuma?',
      'Website evlo cost aagum?',
      'Instagram manage pannuveengala?',
      'Reels pannuveengala?',
    ],
  },
];

export const AssistantPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hello! I am the **Digital Dude Assistant**, the official customer-facing AI for **Digital Dude** (operating since 2022 in Chennai, Tamil Nadu, India).\n\n" +
        'I am strictly grounded in our confirmed knowledge base. You can ask me anything about our 22+ confirmed services, pricing structure, working hours, or project feasibility in **English** or **Tanglish (Tamil)**.\n\n' +
        'How can I help with your digital growth today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const historyPayload = messages.slice(-5).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
        }),
      });

      const data = await res.json();

      if (data && data.reply) {
        const assistantMsg: Message = {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          retrievedChunks: data.retrievedChunks || [],
          mode: data.mode,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error('Invalid response');
      }
    } catch {
      const fallbackMsg: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content:
          "I don't have enough confirmed information about that in my current Digital Dude knowledge base. Please contact Digital Dude directly for the exact details.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReset = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content:
          "Conversation reset. I am ready to answer any questions about Digital Dude's services, pricing guidelines, or working hours.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const renderFormattedText = (raw: string) => {
    const lines = raw.split('\n');
    return lines.map((line, idx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-semibold text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (line.startsWith('• ') || line.startsWith('* ') || line.startsWith('- ')) {
        return (
          <div key={idx} className="flex items-start gap-2 my-1 text-white/90">
            <span className="text-lime font-bold">•</span>
            <span>{formattedParts.slice(1)}</span>
          </div>
        );
      }

      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="leading-relaxed">
          {formattedParts}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-ink pt-28 pb-20 text-white font-[var(--font-body)]">
      {/* Ambient background glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-lime/[0.05] blur-[140px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 relative z-10 space-y-10">
        {/* Page Title & Context Header */}
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lime/10 border border-lime/30 text-lime text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Dude RAG Knowledge Assistant</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Digital Dude <span className="text-outline-accent">Assistant</span>
          </h1>

          <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto leading-relaxed">
            Get instant, 100% grounded answers regarding Digital Dude's services, pricing policies,
            working hours, and project feasibility. Fluent in both{' '}
            <strong className="text-white">English</strong> and{' '}
            <strong className="text-lime">Tanglish (தமிழ்)</strong>.
          </p>
        </div>

        {/* Main Grid: Chat Console + Knowledge Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto">
          {/* Main Chat Console (8 cols on lg) */}
          <div className="lg:col-span-8 bg-ink-soft/90 backdrop-blur-xl border border-white/15 rounded-3xl shadow-2xl flex flex-col h-[700px] overflow-hidden">
            {/* Console Header */}
            <div className="p-4 sm:p-5 bg-ink/90 border-b border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-2xl bg-lime/15 border border-lime/30 flex items-center justify-center text-lime shadow-inner">
                  <Sparkles className="w-5 h-5" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-lime rounded-full ring-2 ring-ink" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white tracking-tight">
                      Digital Dude Assistant
                    </h2>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-lime/20 text-lime border border-lime/30">
                      Grounded AI
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/50 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-lime" />
                      <span>9:30 AM – 5:30 PM (Working Hours)</span>
                    </span>
                    <span>•</span>
                    <span className="text-lime/80 font-mono">Chennai, TN</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-white/60 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Clear Chat</span>
                </button>
              </div>
            </div>

            {/* Factual Safeguard Banner */}
            <div className="bg-lime/[0.04] px-4 py-2.5 border-b border-lime/15 flex items-center justify-between text-xs text-white/70">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-lime shrink-0" />
                <span>Source of Truth: Confirmed business facts &amp; 22 service catalogs.</span>
              </div>
              <span className="text-[11px] font-mono text-lime font-medium hidden sm:inline">
                Zero Speculation Policy
              </span>
            </div>

            {/* Message Thread */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 text-sm">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                        isUser
                          ? 'bg-lime text-ink font-medium rounded-tr-none'
                          : 'bg-white/[0.05] border border-white/10 text-white/90 rounded-tl-none'
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <MarkdownContent content={msg.content} />
                      )}
                    </div>

                    {!isUser && (
                      <div className="flex flex-wrap items-center gap-3 text-xs text-white/40 pl-1">
                        <span>{msg.timestamp}</span>
                        <span>•</span>
                        <span className={`px-2 py-0.5 rounded font-mono text-[10px] ${
                          msg.mode === 'gemini'
                            ? 'bg-lime/20 text-lime border border-lime/30 font-semibold'
                            : 'bg-white/10 text-white/70 border border-white/15'
                        }`}>
                          {msg.mode === 'gemini' ? 'Gemini 3.8 Flash' : 'Grounded Engine'}
                        </span>
                        <span>•</span>
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="hover:text-white flex items-center gap-1 transition-colors"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-lime" />
                              <span className="text-lime">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Answer</span>
                            </>
                          )}
                        </button>

                        {msg.retrievedChunks && msg.retrievedChunks.length > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-lime/70 flex items-center gap-1 text-[11px]">
                              <Shield className="w-3 h-3" />
                              <span>
                                Grounded in: {msg.retrievedChunks.map((c) => c.title).join(', ')}
                              </span>
                            </span>
                          </>
                        )}
                      </div>
                    )}

                    {/* Quick Call-to-action buttons if pricing/contact is mentioned */}
                    {!isUser &&
                      (msg.content.includes('contact Digital Dude directly') ||
                        msg.content.includes('pricing is not fixed') ||
                        msg.content.includes('depend on your requirements')) && (
                        <div className="flex flex-wrap gap-2 pt-1 pl-1">
                          <a
                            href="tel:+919787097006"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs text-white transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5 text-lime" />
                            <span>Call +91 97870-97006</span>
                          </a>
                          <Link
                            to="/contact"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-lime text-ink font-semibold text-xs hover:bg-lime-dim transition-colors"
                          >
                            <span>Request Custom Quotation</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      )}
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-start gap-2">
                  <div className="bg-white/[0.05] border border-white/10 rounded-2xl rounded-tl-none p-4 text-sm flex items-center gap-2 text-white/50">
                    <span className="w-2 h-2 bg-lime rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-lime rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-lime rounded-full animate-bounce" />
                    <span className="text-xs ml-1 text-white/40">
                      Querying Digital Dude knowledge chunks...
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-ink/90 border-t border-white/10">
              <div className="flex items-center gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  id="assistant-page-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      void handleSendMessage();
                    }
                  }}
                  placeholder="Ask a question in English or Tanglish (e.g., 'Website panna mudiyuma?', 'What is your pricing policy?')..."
                  disabled={isLoading}
                  className="flex-1 bg-white/[0.05] border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-lime/60 focus:ring-1 focus:ring-lime/60 transition-all disabled:opacity-50"
                />
                <button
                  id="assistant-page-send-btn"
                  onClick={() => void handleSendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="px-5 py-3.5 rounded-2xl bg-lime hover:bg-lime-dim text-ink font-semibold text-sm transition-all disabled:opacity-30 disabled:hover:bg-lime active:scale-95 flex items-center gap-2"
                >
                  <span>Send</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between text-xs text-white/40 pt-2 px-1">
                <span>Press Enter to send</span>
                <span className="font-mono text-lime/80">
                  Strictly Grounded RAG AI • Operating Since 2022
                </span>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Topics, Facts & Contact Card (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Prompt Explorer Card */}
            <div className="bg-ink-soft/90 border border-white/10 rounded-3xl p-5 sm:p-6 space-y-5">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-lime" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Suggested Questions
                </h3>
              </div>

              <div className="space-y-4">
                {CATEGORY_PROMPTS.map((group, gIdx) => {
                  const Icon = group.icon;
                  return (
                    <div key={gIdx} className="space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-white/60">
                        <Icon className="w-3.5 h-3.5 text-lime" />
                        <span>{group.category}</span>
                      </div>
                      <div className="grid grid-cols-1 gap-1.5">
                        {group.prompts.map((p, pIdx) => (
                          <button
                            key={pIdx}
                            disabled={isLoading}
                            onClick={() => void handleSendMessage(p)}
                            className="text-left px-3 py-2 rounded-xl text-xs bg-white/[0.03] hover:bg-white/[0.08] hover:text-lime border border-white/5 transition-colors leading-relaxed disabled:opacity-50 text-white/80"
                          >
                            &ldquo;{p}&rdquo;
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Official Facts Card */}
            <div className="bg-ink-soft/90 border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4 text-xs">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-lime" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Confirmed Facts
                </h3>
              </div>

              <div className="space-y-3 text-white/70">
                <div className="pb-2 border-b border-white/10">
                  <span className="text-white/40 block">Business Identity</span>
                  <span className="font-semibold text-white">Digital Dude</span>
                  <span className="text-white/50 block">Operating since 2022</span>
                </div>

                <div className="pb-2 border-b border-white/10">
                  <span className="text-white/40 block">Location</span>
                  <span className="text-white font-medium">Chennai, Tamil Nadu, India</span>
                  <span className="text-white/50 block">Poonamallee, Chennai - 600056</span>
                </div>

                <div className="pb-2 border-b border-white/10">
                  <span className="text-white/40 block">Working Hours</span>
                  <span className="text-white font-medium">9:30 AM to 5:30 PM</span>
                  <span className="text-white/40 block">
                    Communication &amp; support handled during these hours
                  </span>
                </div>

                <div className="pb-2 border-b border-white/10">
                  <span className="text-white/40 block">Pricing Structure</span>
                  <span className="text-lime font-medium">No fixed pricing</span>
                  <span className="text-white/50 block">
                    Determined after reviewing requirements &amp; project scope
                  </span>
                </div>

                <div>
                  <span className="text-white/40 block">Direct Inquiries</span>
                  <div className="space-y-1 mt-1">
                    <p className="flex items-center gap-1.5 text-white">
                      <Phone className="w-3.5 h-3.5 text-lime" />
                      <a href="tel:+919787097006" className="hover:text-lime">
                        +91 97870-97006
                      </a>
                    </p>
                    <p className="flex items-center gap-1.5 text-white">
                      <Mail className="w-3.5 h-3.5 text-lime" />
                      <a href="mailto:wedigitaldude@gmail.com" className="hover:text-lime">
                        wedigitaldude@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
