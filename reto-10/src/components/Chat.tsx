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

function ByteNestLogo() {
  return (
    <svg className="chat-logo" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="38" height="38" rx="10" fill="#0e0e14" />
      <rect x="0.5" y="0.5" width="37" height="37" rx="9.5" stroke="rgba(255,255,255,0.08)" />
      <path d="M19 8L9 13.5v11L19 30l10-5.5v-11L19 8z" stroke="#0066ff" strokeWidth="1.5" fill="none" />
      <path d="M19 8L9 13.5 19 19l10-5.5L19 8z" fill="#0066ff" opacity="0.15" />
      <path d="M19 19v11" stroke="#0066ff" strokeWidth="1.5" opacity="0.4" />
      <path d="M9 13.5L19 19l10-5.5" stroke="#0066ff" strokeWidth="1.5" opacity="0.4" />
      <circle cx="19" cy="19" r="2.5" fill="#0066ff" />
    </svg>
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
      <div className="chat-container">
        <header className="chat-header">
          <ByteNestLogo />
          <div className="chat-header-info">
            <h1>ByteNest</h1>
            <p>
              <span className="status-dot"></span>
              Nex — Asesor tech
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
