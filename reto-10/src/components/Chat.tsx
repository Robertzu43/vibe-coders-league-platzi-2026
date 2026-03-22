import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: 'Hola, soy Nex, tu asesor en ByteNest. Puedo ayudarte a encontrar el computador ideal para ti, resolver dudas sobre envios, pagos, garantias o cualquier otra consulta. ¿En que te puedo ayudar?',
};

function NexIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#4d94ff" opacity="0.6" />
      <path d="M2 17l10 5 10-5" stroke="#4d94ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 12l10 5 10-5" stroke="#4d94ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HeroBanner() {
  return (
    <div className="hero-banner">
      {/* Animated waves background */}
      <svg className="hero-waves" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path className="wave wave-1" d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,154.7C672,149,768,171,864,186.7C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
        <path className="wave wave-2" d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,90.7C960,96,1056,128,1152,138.7C1248,149,1344,139,1392,133.3L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
        <path className="wave wave-3" d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,101.3C960,117,1056,139,1152,144C1248,149,1344,139,1392,133.3L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
      </svg>

      {/* Logo */}
      <div className="hero-content">
        <svg className="hero-logo" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="logoGrad" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#4d94ff" />
              <stop offset="100%" stopColor="#0044cc" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path d="M40 6L8 22v36l32 16 32-16V22L40 6z" stroke="url(#logoGrad)" strokeWidth="2" fill="none" filter="url(#glow)" />
          <path d="M40 6L8 22 40 38l32-16L40 6z" fill="url(#logoGrad)" opacity="0.12" />
          <path d="M40 38v36" stroke="url(#logoGrad)" strokeWidth="1.5" opacity="0.3" />
          <path d="M8 22L40 38l32-16" stroke="url(#logoGrad)" strokeWidth="1.5" opacity="0.3" />
          <circle cx="40" cy="38" r="5" fill="url(#logoGrad)" />
          <circle cx="40" cy="38" r="8" stroke="url(#logoGrad)" strokeWidth="1" opacity="0.3" />
          {/* B letter hint */}
          <text x="40" y="43" textAnchor="middle" fill="white" fontSize="12" fontFamily="Outfit, sans-serif" fontWeight="700" opacity="0.9">B</text>
        </svg>
        <h2 className="hero-title">ByteNest</h2>
        <p className="hero-subtitle">Tu nido tecnologico</p>
      </div>

      {/* Bottom wave transition */}
      <svg className="hero-waves-bottom" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path className="wave-bottom wave-bottom-1" d="M0,40L60,50C120,60,240,80,360,85C480,90,600,80,720,70C840,60,960,50,1080,55C1200,60,1320,80,1380,90L1440,100L1440,120L0,120Z" />
        <path className="wave-bottom wave-bottom-2" d="M0,60L60,65C120,70,240,80,360,80C480,80,600,70,720,65C840,60,960,60,1080,65C1200,70,1320,80,1380,85L1440,90L1440,120L0,120Z" />
      </svg>
    </div>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: Message = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const apiMessages = updatedMessages
        .slice(1)
        .map(({ role, content }) => ({ role, content }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.error || 'Lo siento, tuve un problema. ¿Puedes intentar de nuevo?',
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Lo siento, tuve un problema de conexion. ¿Puedes intentar de nuevo?',
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-wrapper">
      {/* Side waves - left */}
      <div className="side-waves side-waves-left">
        <svg viewBox="0 0 120 800" preserveAspectRatio="none">
          <path className="side-wave sw-l1" d="M120,0 C80,100 40,200 60,300 C80,400 20,500 60,600 C100,700 40,750 80,800 L120,800 L120,0Z" />
          <path className="side-wave sw-l2" d="M120,0 C90,80 50,180 70,280 C90,380 30,480 70,580 C110,680 50,730 90,800 L120,800 L120,0Z" />
          <path className="side-wave sw-l3" d="M120,0 C100,60 60,160 80,260 C100,360 40,460 80,560 C120,660 60,710 100,800 L120,800 L120,0Z" />
        </svg>
      </div>

      {/* Side waves - right */}
      <div className="side-waves side-waves-right">
        <svg viewBox="0 0 120 800" preserveAspectRatio="none">
          <path className="side-wave sw-r1" d="M0,0 C40,120 80,220 60,320 C40,420 100,520 60,620 C20,720 80,760 40,800 L0,800 L0,0Z" />
          <path className="side-wave sw-r2" d="M0,0 C30,100 70,200 50,300 C30,400 90,500 50,600 C10,700 70,740 30,800 L0,800 L0,0Z" />
          <path className="side-wave sw-r3" d="M0,0 C20,80 60,180 40,280 C20,360 80,480 40,580 C0,680 60,720 20,800 L0,800 L0,0Z" />
        </svg>
      </div>

      <div className="chat-container">
        <HeroBanner />

        <header className="chat-header">
          <div className="chat-header-info">
            <h1>Nex</h1>
            <p>
              <span className="status-dot"></span>
              Asesor tech en linea
            </p>
          </div>
          <span className="chat-header-badge">AI Assistant</span>
        </header>

        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`message message-${msg.role === 'assistant' ? 'nex' : 'user'}`}>
              <div className="message-avatar">
                {msg.role === 'assistant' ? <NexIcon /> : 'T'}
              </div>
              <div className="message-bubble">{msg.content}</div>
            </div>
          ))}

          {loading && (
            <div className="message message-nex">
              <div className="message-avatar">
                <NexIcon />
              </div>
              <div className="message-bubble">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <div className="chat-input-wrapper">
            <input
              ref={inputRef}
              className="chat-input"
              type="text"
              placeholder="Escribe tu consulta..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
          </div>
          <button className="chat-send" onClick={sendMessage} disabled={loading || !input.trim()}>
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
