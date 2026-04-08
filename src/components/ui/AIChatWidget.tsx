'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, X, Send, Bot, User, Loader2, 
  Sparkles, ChevronDown, RotateCcw 
} from 'lucide-react';
import api from '@/lib/api';

interface Message {
  id: string;
  role: 'user' | 'model';
  parts: string;
  timestamp: Date;
}

const SUGGESTIONS = [
  "How do I create an event?",
  "What's the difference between public and private events?",
  "How does payment work for paid events?",
  "How do I invite people to my private event?",
];

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'model',
  parts: "Hi! 👋 I'm **Plai**, your Planora AI assistant. I'm here to help you discover events, navigate the platform, and get the most out of your experience. What can I help you with today?",
  timestamp: new Date(),
};

// Simple markdown-like bold renderer
function renderText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => scrollToBottom('instant'), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    setShowScrollDown(!isNearBottom);
  };

  const sendMessage = async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      parts: messageText,
      timestamp: new Date(),
    };

    const historyForApi = messages
      .filter((m) => m.id !== 'welcome')
      .map((m) => ({ role: m.role, parts: m.parts }));

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await api.post('/ai/chat', {
        messages: historyForApi,
        userMessage: messageText,
      });

      const reply = response.data?.data?.reply || "I'm sorry, I couldn't generate a response. Please try again.";

      const modelMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        parts: reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (error: any) {
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        parts: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setMessages([WELCOME_MESSAGE]);
    setInputValue('');
  };

  const showSuggestions = messages.length === 1;

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            id="ai-chat-toggle-btn"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/40 text-white ring-4 ring-indigo-500/20"
            aria-label="Open AI Chat"
          >
            <Sparkles className="h-6 w-6" />
            {/* Ping dot */}
            <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-blue-500 border-2 border-white" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="ai-chat-window"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-[100] flex h-[620px] w-[380px] max-h-[90vh] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-2xl shadow-black/20 dark:border-zinc-800 dark:bg-zinc-900"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-bold text-white leading-none">Plai</p>
                  <p className="text-[11px] text-blue-100 mt-0.5">Planora AI Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={resetChat}
                  className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  title="Reset conversation"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close chat"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Online indicator */}
            <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/30 px-5 py-2 border-b border-indigo-100 dark:border-indigo-900/50">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">AI Online · Powered by Gemini</span>
            </div>

            {/* Messages */}
            <div
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#e4e4e7 transparent' }}
            >
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-full ${
                    msg.role === 'model' 
                      ? 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white' 
                      : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'
                  }`}>
                    {msg.role === 'model' 
                      ? <Sparkles className="h-3.5 w-3.5" /> 
                      : <User className="h-3.5 w-3.5" />
                    }
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'model'
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 rounded-tl-sm'
                      : 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-tr-sm'
                  }`}>
                    {renderText(msg.parts)}
                  </div>
                </motion.div>
              ))}

              {/* Quick Suggestions */}
              {showSuggestions && (
                <div className="space-y-2">
                  <p className="text-[11px] font-medium text-zinc-400 px-1">Quick questions:</p>
                  {SUGGESTIONS.map((s, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => sendMessage(s)}
                      className="block w-full text-left rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-xs text-zinc-600 dark:text-zinc-300 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all"
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2.5"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex-shrink-0">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0ms]" />
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:150ms]" />
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Scroll to bottom */}
            <AnimatePresence>
              {showScrollDown && !isLoading && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => scrollToBottom()}
                  className="absolute bottom-20 right-4 p-1.5 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-md text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Input */}
            <div className="border-t border-zinc-100 dark:border-zinc-800 p-4">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  id="ai-chat-input"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Plai anything..."
                  rows={1}
                  disabled={isLoading}
                  className="flex-1 resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 disabled:opacity-50 transition-all"
                  style={{ maxHeight: '120px', overflowY: 'auto' }}
                />
                <button
                  id="ai-chat-send-btn"
                  onClick={() => sendMessage()}
                  disabled={isLoading || !inputValue.trim()}
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] text-zinc-400">
                Plai can make mistakes. Verify important info.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
