import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  Phone,
  Mail,
  Shield,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { MarkdownContent } from './MarkdownContent';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  retrievedChunks?: { id: string; title: string; category: string }[];
  mode?: 'gemini' | 'rule_fallback';
}

const QUICK_PROMPTS = [
  'How much for a new website?',
  'Can you manage my Instagram & Reels?',
  'Website panna mudiyuma?',
  'What services do you offer?',
  'Can we schedule a call?',
];

export const DigitalDudeAssistantWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenedBefore, setHasOpenedBefore] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedChunkId, setExpandedChunkId] = useState<string | null>(null);

  const initialMessage: ChatMessage = {
    id: 'msg-welcome',
    role: 'assistant',
    content:
      "Hey there! 👋 I'm here from the **Digital Dude** team in Chennai.\n\n" +
      "Whether you're looking to launch a fast, high-converting website, scale your sales with targeted ads, or create viral Reels — we've got you covered.\n\n" +
      "What kind of business are you running, and what are you looking to build?",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages, isLoading]);

  const handleOpen = () => {
    setIsOpen(true);
    setHasOpenedBefore(true);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
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
        const assistantMsg: ChatMessage = {
          id: `msg-asst-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          retrievedChunks: data.retrievedChunks || [],
          mode: data.mode,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSendMessage();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReset = () => {
    setMessages([initialMessage]);
  };

  // Helper to format assistant markdown text (bold, lists, linebreaks)
  const renderFormattedText = (raw: string) => {
    const lines = raw.split('\n');
    return lines.map((line, idx) => {
      // Parse markdown bold **text**
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
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <div className="relative group">
          {/* Welcome tooltip indicator if unread */}
          {!hasOpenedBefore && (
            <div className="absolute -top-12 right-0 bg-ink-soft border border-lime/40 text-lime text-xs px-3 py-1.5 rounded-xl shadow-lg whitespace-nowrap animate-bounce flex items-center gap-1.5 pointer-events-none">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask Digital Dude Assistant</span>
            </div>
          )}

          <button
            id="open-digital-dude-assistant-btn"
            onClick={handleOpen}
            aria-label="Open Digital Dude Assistant"
            className="flex items-center gap-3 px-4 py-3 rounded-full bg-lime text-ink font-semibold shadow-2xl hover:bg-lime-dim transition-all duration-300 transform group-hover:scale-105 active:scale-95 border-2 border-white/20"
          >
            <div className="relative">
              <MessageSquare className="w-5 h-5 fill-ink" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-ink rounded-full ring-2 ring-lime animate-ping" />
            </div>
            <span className="text-sm font-bold tracking-tight pr-1">Digital Dude Assistant</span>
          </button>
        </div>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div
          id="digital-dude-assistant-modal"
          role="dialog"
          aria-label="Digital Dude Assistant Chat"
          className="w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-ink-soft/95 backdrop-blur-xl border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Header */}
          <div className="p-4 bg-ink/90 border-b border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl bg-lime/10 border border-lime/30 flex items-center justify-center text-lime shadow-inner">
                <Sparkles className="w-4 h-4" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-lime rounded-full ring-2 ring-ink animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    Digital Dude Team
                  </h3>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-lime/20 text-lime border border-lime/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-lime" />
                    Online
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-white/50">
                  <Clock className="w-3 h-3 text-lime" />
                  <span>Mon–Sat: 9:30 AM – 5:30 PM IST</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                title="Reset Conversation"
                className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Reset conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                id="close-assistant-btn"
                onClick={() => setIsOpen(false)}
                title="Close Assistant"
                className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Close assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Grounding Notice */}
          <div className="bg-lime/[0.04] px-3.5 py-2 border-b border-lime/15 flex items-center justify-between text-[11px] text-white/70">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-lime shrink-0" />
              <span>Verified Digital Dude services &amp; team guide</span>
            </div>
            <span className="text-[10px] text-lime font-mono">English / Tanglish</span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs font-[var(--font-body)]">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 shadow-sm text-xs ${
                      isUser
                        ? 'bg-lime text-ink font-medium rounded-tr-none'
                        : 'bg-white/[0.06] border border-white/10 text-white/85 rounded-tl-none'
                    }`}
                  >
                    {isUser ? (
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <MarkdownContent content={msg.content} />
                    )}
                  </div>

                  {/* Assistant Footer Info (Copy & Grounding Chunks) */}
                  {!isUser && (
                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-white/40 pl-1">
                      <span>{msg.timestamp}</span>
                      <span>•</span>
                      <span className={`px-1.5 py-0.5 rounded font-mono text-[9px] ${
                        msg.mode === 'gemini'
                          ? 'bg-lime/20 text-lime border border-lime/30 font-semibold'
                          : 'bg-white/10 text-white/70 border border-white/15'
                      }`}>
                        {msg.mode === 'gemini' ? 'Gemini 3.8 Flash' : 'Digital Dude AI'}
                      </span>
                      <span>•</span>
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="hover:text-white flex items-center gap-1 transition-colors"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-2.5 h-2.5 text-lime" />
                            <span className="text-lime">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-2.5 h-2.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      {msg.retrievedChunks && msg.retrievedChunks.length > 0 && (
                        <>
                          <span>•</span>
                          <button
                            onClick={() =>
                              setExpandedChunkId(
                                expandedChunkId === msg.id ? null : msg.id
                              )
                            }
                            className="hover:text-lime text-lime/70 flex items-center gap-1 transition-colors"
                          >
                            <span>Verified Sources ({msg.retrievedChunks.length})</span>
                            {expandedChunkId === msg.id ? (
                              <ChevronUp className="w-2.5 h-2.5" />
                            ) : (
                              <ChevronDown className="w-2.5 h-2.5" />
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {/* Expanded Retrieved Chunks Badge */}
                  {!isUser && expandedChunkId === msg.id && msg.retrievedChunks && (
                    <div className="w-[88%] p-2 rounded-xl bg-ink/70 border border-lime/20 text-[10px] text-white/60 space-y-1 mt-1">
                      <div className="font-semibold text-lime text-[10px] flex items-center gap-1">
                        <Shield className="w-2.5 h-2.5" />
                        <span>Retrieved Knowledge Base Chunks:</span>
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 text-white/70">
                        {msg.retrievedChunks.map((chunk) => (
                          <li key={chunk.id}>
                            <span className="text-white">{chunk.title}</span>{' '}
                            <span className="text-white/40">({chunk.category})</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Direct Contact Buttons if assistant suggests contacting */}
                  {!isUser &&
                    (msg.content.includes('contact Digital Dude directly') ||
                      msg.content.includes('wedigitaldude@gmail.com') ||
                      msg.content.includes('pricing is not fixed') ||
                      msg.content.includes('depend on your requirements')) && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <a
                          href="tel:+919787097006"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[10px] text-white/80 transition-colors"
                        >
                          <Phone className="w-2.5 h-2.5 text-lime" />
                          <span>Call: +91 97870-97006</span>
                        </a>
                        <Link
                          to="/contact"
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-lime/10 hover:bg-lime/20 border border-lime/30 text-[10px] text-lime transition-colors"
                        >
                          <Mail className="w-2.5 h-2.5" />
                          <span>Get Free Quote</span>
                        </Link>
                      </div>
                    )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="bg-white/[0.06] border border-white/10 rounded-2xl rounded-tl-none px-3.5 py-2.5 text-xs flex items-center gap-1.5 text-white/50">
                  <span className="w-1.5 h-1.5 bg-lime rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-lime rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-lime rounded-full animate-bounce" />
                  <span className="text-[11px] ml-1 text-white/40">Checking knowledge base...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Prompt Pills */}
          <div className="px-3 py-2 bg-ink/50 border-t border-white/5 overflow-x-auto no-scrollbar flex items-center gap-1.5">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                disabled={isLoading}
                onClick={() => void handleSendMessage(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/[0.04] hover:bg-white/[0.09] text-white/70 hover:text-white border border-white/10 transition-colors shrink-0 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-ink/90 border-t border-white/10">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                id="digital-dude-assistant-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about services, pricing, hours... (English/Tanglish)"
                disabled={isLoading}
                className="flex-1 bg-white/[0.05] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-lime/60 focus:ring-1 focus:ring-lime/60 transition-all disabled:opacity-50"
              />
              <button
                id="digital-dude-assistant-send-btn"
                onClick={() => void handleSendMessage()}
                disabled={!input.trim() || isLoading}
                aria-label="Send query"
                className="p-2.5 rounded-xl bg-lime hover:bg-lime-dim text-ink font-bold transition-all disabled:opacity-30 disabled:hover:bg-lime active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between text-[10px] text-white/30 pt-1.5 px-0.5">
              <span>Press Enter to send</span>
              <span>English &amp; Tanglish supported</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
