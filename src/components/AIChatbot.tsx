import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Navigation,
  ShieldAlert,
  X,
  Minimize2,
  Maximize2,
  RefreshCw,
  MapPin,
  HelpCircle,
  Radio,
} from 'lucide-react';
import { ChatMessage, GeoCoordinates } from '../types';
import { aiAssistantService } from '../services/aiAssistantService';

interface AIChatbotProps {
  userLocation: GeoCoordinates;
  onNavigateToMapWithRoute?: (routeId?: string, focusCoords?: GeoCoordinates) => void;
  isOpenDefault?: boolean;
  id?: string;
}

export const AIChatbot: React.FC<AIChatbotProps> = ({
  userLocation,
  onNavigateToMapWithRoute,
  isOpenDefault = false,
  id = 'ai-chatbot',
}) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `Namaste! I am PRAVAH AI, your 24/7 disaster risk and evacuation intelligence system. I am monitoring live telemetry from Indian reservoirs and river basins.
      
Ask me:
• "Am I safe?"
• "Show me the safest route"
• "Tehri Dam status"
• "Nearest relief shelter"`,
      timestamp: 'Just now',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isThinking) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsThinking(true);

    try {
      const response = await aiAssistantService.processUserPrompt(query, userLocation);

      setMessages((prev) => [...prev, response.message]);

      // If response requires navigation to the LiveMap with highlighted route
      if (response.navigatePage === 'live-map' && onNavigateToMapWithRoute) {
        setTimeout(() => {
          onNavigateToMapWithRoute(response.highlightRouteId, response.focusCoordinates);
        }, 1200);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'Unable to connect to live telemetry servers. Retrying connection...',
          timestamp: 'Now',
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const quickPrompts = [
    'Am I safe?',
    'Show me the safest route',
    'Nearest relief shelter',
    'Tehri Dam status',
  ];

  return (
    <div id={id} className="fixed bottom-5 right-5 z-40">
      {/* Minimized / Floating Toggle Button */}
      {!isOpen && (
        <button
          id={`${id}-open-toggle`}
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-bold text-sm shadow-[0_8px_30px_rgba(6,182,212,0.4)] border border-cyan-400/40 hover:scale-105 transition-all duration-200 cursor-pointer"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span>PRAVAH AI Assistant</span>
        </button>
      )}

      {/* Main Chatbot Window */}
      {isOpen && (
        <div
          id={`${id}-window`}
          className={`flex flex-col rounded-2xl bg-[#091527]/95 backdrop-blur-2xl border border-cyan-500/40 shadow-[0_15px_50px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-300 ${
            isMinimized
              ? 'w-80 h-14'
              : 'w-[90vw] sm:w-96 md:w-[420px] h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-[#0d1d36] to-[#0a2342] px-4 py-3 border-b border-sky-500/30 flex items-center justify-between text-white select-none">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold tracking-tight">PRAVAH AI Intelligence</h4>
                  <span className="flex items-center gap-1 text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    <Radio className="w-2.5 h-2.5 animate-pulse" /> LIVE GIS
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Connected to CWC, IMD & NDMA Telemetry</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                id={`${id}-minimize-btn`}
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                id={`${id}-close-btn`}
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          {!isMinimized && (
            <>
              <div
                id={`${id}-messages-container`}
                className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs"
              >
                {messages.map((msg) => {
                  const isAssistant = msg.sender === 'assistant';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                          isAssistant
                            ? 'bg-[#0f223a] text-slate-200 border border-sky-500/20 shadow-md'
                            : 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white font-medium shadow-md'
                        }`}
                      >
                        <div className="whitespace-pre-line">{msg.text}</div>

                        {/* Interactive action trigger payload button */}
                        {msg.actionPayload?.type === 'NAVIGATE_MAP_ROUTE' && onNavigateToMapWithRoute && (
                          <button
                            type="button"
                            onClick={() =>
                              onNavigateToMapWithRoute(
                                msg.actionPayload?.routeId,
                                msg.actionPayload?.focusCoordinates
                              )
                            }
                            className="mt-3 w-full py-2 px-3 rounded-xl bg-cyan-400 text-sky-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md hover:bg-cyan-300 transition-all cursor-pointer"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                            <span>OPEN LIVE MAP WITH BLUE EVACUATION ROUTE</span>
                          </button>
                        )}
                      </div>

                      <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
                    </div>
                  );
                })}

                {/* Thinking indicator */}
                {isThinking && (
                  <div className="flex items-center gap-2 text-cyan-400 text-xs p-2 rounded-xl bg-sky-950/40 w-fit">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing live sensor telemetry & GIS terrain...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Bar */}
              <div className="px-3 py-2 border-t border-slate-800 bg-[#071322]/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSendMessage(prompt)}
                    className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-sky-950/60 hover:bg-sky-900 text-[11px] text-cyan-300 font-medium border border-sky-500/20 transition-all cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <form
                id={`${id}-input-form`}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 border-t border-slate-800 bg-[#0a1728] flex items-center gap-2"
              >
                <input
                  id={`${id}-text-input`}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask PRAVAH AI (e.g. Am I safe?, Show route)..."
                  className="flex-1 bg-slate-900/90 border border-slate-700/80 focus:border-cyan-400 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none transition-colors"
                />
                <button
                  id={`${id}-send-btn`}
                  type="submit"
                  disabled={!inputValue.trim() || isThinking}
                  className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-sky-950 font-bold disabled:opacity-40 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};
