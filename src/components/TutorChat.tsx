import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, User, Send, Sparkles, RefreshCw, Trash2, HelpCircle, 
  ChevronRight, Volume2, Globe, MessageSquareDiff, GraduationCap
} from 'lucide-react';
import { speakWord } from '../data';

interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

const STARTER_PROMPTS = [
  {
    title: "Practicar saludos",
    prompt: "Hola, me gustaría practicar saludos formales e informales en francés. ¿Me enseñas?"
  },
  {
    title: "Presentación personal",
    prompt: "Pregúntame en francés cómo me llamo para practicar mi respuesta de presentación del nivel A1."
  },
  {
    title: "Diferencia Tu vs. Vous",
    prompt: "¿Me explicas con ejemplos sencillos cuándo debo usar 'Tu' y cuándo debo usar 'Vous' en francés?"
  },
  {
    title: "Verbo Être y S'appeler",
    prompt: "¿Cómo se conjugan los verbos esenciales 'être' y 's'appeler' para la Unidad 1?"
  }
];

export default function TutorChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message if empty
  useEffect(() => {
    const saved = localStorage.getItem('french_tutor_chat_history');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
        return;
      } catch (e) {
        console.error(e);
      }
    }
    
    // Set default initial greeting
    setMessages([
      {
        role: 'model',
        content: "¡**Bonjour**! Soy tu **Tutor de Francés IA** 🇫🇷. Estoy aquí para ser tu compañero de práctica en la **Unidad 1: Se Présenter et Saluer**.\n\nPuedo ayudarte con:\n* Aprender saludos formales e informales.\n* Practicar tu presentación personal de nivel A1.\n* Explicar gramática básica (verbo **être**, verbo **s'appeler**, artículos, etc.).\n* ¡Hacer ejercicios de conversación cortos!\n\n¿Por qué tema te gustaría comenzar a charlar hoy?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (messages.length > 1) {
      localStorage.setItem('french_tutor_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    setError(null);
    const userMessage: Message = {
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Send message history to our backend /api/tutor
      const historyToSend = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: historyToSend })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Fallo general en el Tutor de Inteligencia Artificial.');
      }

      const data = await res.json();
      
      const assistantMessage: Message = {
        role: 'model',
        content: data.text || 'Lo siento, no pude formular una respuesta apropiada.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'No se pudo conectar con el servidor del tutor. Revisa tu conexión a internet.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('¿Estás seguro de que deseas reiniciar tu conversación con el tutor? El historial se borrará.')) {
      localStorage.removeItem('french_tutor_chat_history');
      setMessages([
        {
          role: 'model',
          content: "¡**Bonjour**! Conversación reiniciada. ¿Con qué tema del nivel A1 te gustaría empezar ahora? Puedes preguntarme gramática, vocabulario o pedirme ejercicios para responder.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setError(null);
    }
  };

  // Speaks complete paragraphs or selected text in clean French
  const handleTTS = (text: string) => {
    // Strip bold markers and conversational prefix in spanish
    let cleanText = text
      .trim()
      .replace(/\*\*|__/g, '');
    
    // Find french phrases within parentheses or quotes
    const regex = /["«']([^"»']+)["»']/g;
    const phrases: string[] = [];
    let match;
    while ((match = regex.exec(cleanText)) !== null) {
      phrases.push(match[1]);
    }

    if (phrases.length > 0) {
      // If we found specific quoted French phrases, read the first one
      speakWord(phrases[0]);
    } else {
      // Otherwise attempt to speak the text block directly
      speakWord(cleanText);
    }
  };

  // Parse custom styled assistant output supporting rich lists, paragraphs and bold highlights
  const renderMessageContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, lIdx) => {
      let currentLine = line.trim();
      if (!currentLine) return <div key={lIdx} className="h-2" />;

      const isBullet = currentLine.startsWith('* ') || currentLine.startsWith('- ');
      const isNumbered = /^\d+\.\s/.test(currentLine);

      if (isBullet) {
        currentLine = currentLine.replace(/^[\*\-]\s+/, '');
      } else if (isNumbered) {
        currentLine = currentLine.replace(/^\d+\.\s+/, '');
      }

      // Format bold constructs **bold**
      const parts = currentLine.split(/(\*\*.*?\*\*)/g);
      const textNodes = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-extrabold text-slate-900 bg-indigo-50/50 px-1 rounded">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <li key={lIdx} className="ml-4 list-disc text-xs text-slate-700 leading-relaxed my-1 pl-1">
            {textNodes}
          </li>
        );
      }

      if (isNumbered) {
        return (
          <li key={lIdx} className="ml-5 list-decimal text-xs text-slate-700 leading-relaxed my-1 pl-1">
            {textNodes}
          </li>
        );
      }

      return (
        <p key={lIdx} className="text-xs text-slate-700 leading-relaxed my-1.5 text-justify">
          {textNodes}
        </p>
      );
    });
  };

  return (
    <div id="tutor-chat-container" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* Sidebar - Quick info and prompts */}
      <div className="lg:col-span-4 bg-white border border-slate-150 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="h-10 w-10 bg-indigo-50 text-indigo-700 rounded-xl flex items-center justify-center shrink-0">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Tutor Personal IA</h3>
            <p className="text-[11px] text-slate-500 font-medium">Asesor escolar de Francés A1 disponible 24/7</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl">
            <h4 className="text-xs font-bold text-slate-700 mb-1">🎯 Objetivo Académico</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Consolida la Unidad 1 resolviendo dudas de gramática, vocabulario y verbos directamente. Puedes escribir en español o francés.
            </p>
          </div>

          <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl">
            <h4 className="text-xs font-bold text-indigo-800 mb-1">📢 Pronunciación de Frases</h4>
            <p className="text-[11px] text-indigo-950/80 leading-relaxed">
              Al lado de cada respuesta del Tutor verás un botón de reproducción. Hazle clic para escuchar la pronunciación del texto de consulta utilizando el reproductor de voz incorporado.
            </p>
          </div>
        </div>

        {/* Suggested prompts list */}
        <div className="space-y-2 pt-2">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Sugerencias rápidas:</span>
          <div className="grid grid-cols-1 gap-2">
            {STARTER_PROMPTS.map((item, idx) => (
              <button
                key={idx}
                id={`starter-prompt-button-${idx}`}
                onClick={() => handleSendMessage(item.prompt)}
                disabled={isLoading}
                className="text-left p-2.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl text-xs font-semibold text-slate-700 hover:text-indigo-950 transition-all flex items-center justify-between gap-1 disabled:opacity-50"
              >
                <span>{item.title}</span>
                <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-450" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="lg:col-span-8 bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[560px]">
        
        {/* Chat Header */}
        <div className="bg-slate-50 border-b border-slate-150 p-4 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8.5 w-8.5 bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white rounded-lg flex items-center justify-center shadow-xs">
              <Bot className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">Chat interactivo con Tutor IA</h3>
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Activo y En línea</span>
              </div>
            </div>
          </div>

          <button
            id="clear-chat-history-btn"
            onClick={handleClearHistory}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
            title="Reiniciar chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Chat History Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/20">
          {messages.map((m, idx) => {
            const isBot = m.role === 'model';
            return (
              <div
                key={idx}
                id={`chat-msg-${idx}`}
                className={`flex gap-3 max-w-[85%] ${isBot ? 'mr-auto items-start' : 'ml-auto flex-row-reverse items-start'}`}
              >
                {/* Avatar Icon */}
                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                  isBot ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-800'
                }`}>
                  {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>

                {/* Bubble content */}
                <div className="space-y-1">
                  <div className={`p-3.5 rounded-2xl shadow-xxs block border transition-all ${
                    isBot 
                      ? 'bg-white border-slate-200 text-slate-900 rounded-tl-none' 
                      : 'bg-indigo-600 border-indigo-700 text-white rounded-tr-none'
                  }`}>
                    {isBot ? (
                      renderMessageContent(m.content)
                    ) : (
                      <p className="text-xs leading-relaxed whitespace-pre-wrap">{m.content}</p>
                    )}
                  </div>
                  
                  {/* Message Actions */}
                  <div className={`flex items-center gap-2.5 text-[9px] text-slate-400 px-1 font-mono ${
                    isBot ? 'justify-start' : 'justify-end'
                  }`}>
                    <span>{m.timestamp}</span>
                    {isBot && (
                      <button
                        onClick={() => handleTTS(m.content)}
                        className="text-indigo-500 hover:text-indigo-800 font-bold flex items-center gap-0.5 hover:underline"
                        title="Escuchar francés en este mensaje"
                      >
                        <Volume2 className="w-3 h-3" /> Escuchar locución
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 max-w-[80%] mr-auto">
              <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 animate-bounce">
                <Bot className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <div className="p-3 bg-white border border-slate-200 rounded-2xl rounded-tl-none flex items-center gap-1 px-4 py-3">
                  <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="h-1.5 w-1.5 bg-indigo-600 rounded-full animate-bounce"></span>
                </div>
                <span className="text-[9px] text-slate-400 font-mono px-1">El tutor está redactando una explicación...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-950 text-xs flex flex-col gap-2">
              <div className="flex items-center gap-2 font-bold">
                <span>⚠️ Error de Conexión</span>
              </div>
              <p className="opacity-90">{error}</p>
              <button 
                onClick={() => handleSendMessage(messages[messages.length - 1]?.content || '')}
                className="self-end px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-black transition-all"
              >
                Reintentar último envío
              </button>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Form area */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
          className="border-t border-slate-150 p-3 bg-slate-50 shrink-0 flex items-center gap-2"
        >
          <input
            id="tutor-chat-keyboard-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Pregúntale al tutor sobre saludos, s'appeler, être, vous o tu..."
            disabled={isLoading}
            className="flex-1 text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-medium disabled:opacity-60"
          />
          <button
            id="tutor-chat-send-btn"
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-extrabold rounded-xl text-xs transition-all flex items-center gap-1 focus:outline-none cursor-pointer"
          >
            <span>Enviar</span>
            <Send className="w-3 h-3 shrink-0" />
          </button>
        </form>

      </div>

    </div>
  );
}
