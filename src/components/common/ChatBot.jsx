import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2 } from 'lucide-react';

const SYSTEM_PROMPT = `Tu es Logezy Assistant, un assistant immobilier expert au Bénin. 
Tu aides les utilisateurs à trouver des logements, comprendre le marché immobilier béninois, 
et naviguer sur la plateforme Logezy.

Tu connais :
- Les villes du Bénin : Cotonou, Porto-Novo, Parakou, Abomey-Calavi, Bohicon, Natitingou, Ouidah, Lokossa
- Les prix moyens du marché immobilier béninois
- Les quartiers populaires de chaque ville
- Les conseils pour louer ou acheter au Bénin
- Le fonctionnement de la plateforme Logezy

Réponds toujours en français, de manière concise et utile.
Si on te demande de faire quelque chose hors de ton domaine, redirige vers l'immobilier.`;

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Bonjour ! 👋 Je suis Logezy Assistant. Comment puis-je vous aider pour votre recherche immobilière au Bénin ?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && !minimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open, minimized]);

  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, minimized]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 500,
          system: SYSTEM_PROMPT,
          messages: newMessages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();
      const assistantMessage = {
        role: 'assistant',
        content: data.content[0].text,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (e) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Désolé, je rencontre un problème technique. Veuillez réessayer.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const SUGGESTIONS = [
    'Prix moyen à Cotonou ?',
    'Meilleurs quartiers ?',
    'Comment louer ?',
  ];

  return (
    <>
      {/* Bouton flottant */}
      {!open && (
        <button onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#3A7D44] hover:bg-[#2D6235] text-white rounded-full shadow-[0_8px_30px_rgba(58,125,68,0.4)] flex items-center justify-center transition-all hover:scale-110 active:scale-95 md:bottom-8 md:right-8">
          <MessageCircle size={24} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
        </button>
      )}

      {/* Fenêtre chat */}
      {open && (
        <div className={`fixed z-50 transition-all duration-300 ${
          minimized
            ? 'bottom-6 right-6 w-72'
            : 'bottom-6 right-6 w-80 md:w-96'
        }`}>
          <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-[#E8E8E8] dark:border-[#2A2A2A] overflow-hidden">

            {/* Header */}
            <div className="bg-gradient-to-r from-[#3A7D44] to-[#2D6235] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">Logezy Assistant</div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#4CAF50] rounded-full animate-pulse" />
                    <span className="text-white/70 text-xs">En ligne</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setMinimized(!minimized)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors">
                  <Minimize2 size={14} />
                </button>
                <button onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors">
                  <X size={14} />
                </button>
              </div>
            </div>

            {!minimized && (
              <>
                {/* Messages */}
                <div className="h-72 overflow-y-auto p-4 space-y-3 bg-[#F8F9FA] dark:bg-[#0F172A]">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex items-start gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.role === 'assistant' && (
                        <div className="w-7 h-7 rounded-full bg-[#3A7D44] flex items-center justify-center shrink-0 mt-0.5">
                          <Bot size={14} className="text-white" />
                        </div>
                      )}
                      <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-[#3A7D44] text-white rounded-br-sm'
                          : 'bg-white dark:bg-[#1A1A1A] text-[#0F172A] dark:text-white border border-[#E8E8E8] dark:border-[#2A2A2A] rounded-bl-sm'
                      }`}>
                        {msg.content}
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-7 h-7 rounded-full bg-[#E8E8E8] dark:bg-[#2A2A2A] flex items-center justify-center shrink-0 mt-0.5">
                          <User size={14} className="text-[#64748B]" />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {loading && (
                    <div className="flex items-start gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#3A7D44] flex items-center justify-center shrink-0">
                        <Bot size={14} className="text-white" />
                      </div>
                      <div className="bg-white dark:bg-[#1A1A1A] border border-[#E8E8E8] dark:border-[#2A2A2A] px-4 py-3 rounded-2xl rounded-bl-sm">
                        <div className="flex gap-1">
                          {[0,1,2].map(i => (
                            <div key={i} className="w-2 h-2 bg-[#3A7D44] rounded-full animate-bounce"
                              style={{ animationDelay: `${i * 0.15}s` }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Suggestions */}
                {messages.length === 1 && (
                  <div className="px-4 pb-2 flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s, i) => (
                      <button key={i} onClick={() => { setInput(s); inputRef.current?.focus(); }}
                        className="text-xs bg-[#EBF5ED] text-[#3A7D44] font-medium px-3 py-1.5 rounded-full hover:bg-[#3A7D44] hover:text-white transition-all">
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div className="p-3 border-t border-[#E8E8E8] dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] flex items-end gap-2">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Posez votre question..."
                    rows={1}
                    className="flex-1 resize-none bg-[#F8F9FA] dark:bg-[#0F172A] border border-[#E8E8E8] dark:border-[#2A2A2A] rounded-xl px-3 py-2.5 text-sm text-[#0F172A] dark:text-white outline-none focus:border-[#3A7D44] transition-colors placeholder:text-[#C0C0C0] max-h-24"
                    style={{ scrollbarWidth: 'none' }}
                  />
                  <button onClick={sendMessage} disabled={loading || !input.trim()}
                    className="w-9 h-9 bg-[#3A7D44] hover:bg-[#2D6235] disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-all shrink-0">
                    <Send size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}