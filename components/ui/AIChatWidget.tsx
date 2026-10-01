'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface QuoteData {
  name: string;
  email: string;
  company: string;
  projectType: string;
  countryCode: string;
  contactNumber: string;
  timeline: string;
  message: string;
}

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Add welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: "Hey there! 👋 I'm **Stromy**, your GLOYAS assistant. I can tell you about our services, our team, or help you get a free project quote right here. What would you like to know?",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length]);

  // Hide tooltip when chat opens
  useEffect(() => {
    if (isOpen) {
      setShowTooltip(false);
    }
  }, [isOpen]);

  // Show tooltip on page load after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) setShowTooltip(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const sanitizeContent = (text: string): string => {
    if (!text) return '';
    let cleaned = text;

    // 1. Remove complete |||SUBMIT_QUOTE|||...|||END_QUOTE||| blocks
    cleaned = cleaned.replace(/\|\|\|SUBMIT_QUOTE\|\|\|[\s\S]*?\|\|\|END_QUOTE\|\|\|/g, '');

    // 2. Remove in-flight / streaming |||SUBMIT_QUOTE||| block up to the end
    cleaned = cleaned.replace(/\|\|\|SUBMIT_QUOTE\|\|\|[\s\S]*$/g, '');

    // 3. Remove partial trailing delimiter (e.g. "|||", "|||SUBMIT", etc.)
    cleaned = cleaned.replace(/\|\|\|[A-Za-z0-9_]*$/g, '');

    // 4. Remove complete markdown code blocks containing quote JSON fields
    cleaned = cleaned.replace(/```(?:json)?\s*\{[\s\S]*?(?:"name"|"email"|"projectType"|"contactNumber")[\s\S]*?\}\s*```/gi, '');

    // 5. Remove in-flight markdown code blocks streaming quote JSON fields
    cleaned = cleaned.replace(/```(?:json)?\s*\{[\s\S]*?(?:"name"|"email"|"projectType"|"contactNumber")[\s\S]*$/gi, '');

    // 6. Remove standalone JSON objects containing quote keys if leaked
    cleaned = cleaned.replace(/\{[\s\r\n]*"(?:name|email|projectType)"[\s\S]*?"(?:timeline|message|contactNumber)"[\s\S]*?\}\s*/gi, '');

    // 7. Remove introductory phrases like "Submitting the response:", "Submitting your quote:", etc. if left dangling
    cleaned = cleaned.replace(/(?:Submitting|Sending)(?:\s+(?:the|your))?\s+(?:response|quote|details|form|data|inquiry)(?:\s+in\s+code\s+form)?\s*[:\.]?\s*$/gim, '');

    return cleaned.trim();
  };

  const extractAndSubmitQuote = async (text: string): Promise<string> => {
    let jsonStr: string | null = null;

    // 1. Match standard delimiter
    const quoteMatch = text.match(
      /\|\|\|SUBMIT_QUOTE\|\|\|([\s\S]*?)\|\|\|END_QUOTE\|\|\|/
    );
    if (quoteMatch) {
      jsonStr = quoteMatch[1].trim();
    } else {
      // 2. Fallback: match markdown code block
      const codeMatch = text.match(
        /```(?:json)?\s*(\{[\s\S]*?"(?:name|email|projectType)"[\s\S]*?\})\s*```/i
      );
      if (codeMatch) {
        jsonStr = codeMatch[1].trim();
      } else {
        // 3. Fallback: match raw JSON
        const rawJsonMatch = text.match(
          /(\{[\s\r\n]*"(?:name|email|projectType)"[\s\S]*?"(?:timeline|message|contactNumber)"[\s\S]*?\})/i
        );
        if (rawJsonMatch) {
          jsonStr = rawJsonMatch[1].trim();
        }
      }
    }

    if (!jsonStr) {
      return sanitizeContent(text);
    }

    try {
      const quoteData: QuoteData = JSON.parse(jsonStr);
      setIsSubmittingQuote(true);

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quoteData),
      });

      if (response.ok) {
        setQuoteSubmitted(true);
        const cleanText = sanitizeContent(text);
        return (
          cleanText ||
          "✅ **Your project inquiry has been submitted successfully!** Our team will review your details and get back to you within 24 hours. We're excited to work with you! 🚀"
        );
      } else {
        const cleanText = sanitizeContent(text);
        return (
          cleanText ||
          "⚠️ There was an issue submitting your inquiry. Please try again or reach out to us directly at **gloyas.connect@gmail.com**."
        );
      }
    } catch (err) {
      console.error('Quote extraction error:', err);
      return sanitizeContent(text);
    } finally {
      setIsSubmittingQuote(false);
    }
  };

  const sendMessage = async (directMessage?: string) => {
    const trimmed = (directMessage || input).trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    // Prepare messages for API (exclude any internal tags from message history)
    const apiMessages = updatedMessages.map((m) => ({
      role: m.role,
      content: sanitizeContent(m.content),
    }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const assistantId = (Date.now() + 1).toString();
      let fullContent = '';

      // Add empty assistant message
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: 'assistant',
          content: '',
          timestamp: new Date(),
        },
      ]);

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                fullContent += parsed.content;
                if (
                  (fullContent.includes('|||SUBMIT_QUOTE|||') || fullContent.includes('"projectType"')) &&
                  !isSubmittingQuote
                ) {
                  setIsSubmittingQuote(true);
                }
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, content: fullContent } : m
                  )
                );
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }
      }

      // Check for quote submission in the complete response
      const processedContent = await extractAndSubmitQuote(fullContent);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: processedContent } : m
        )
      );
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content:
            "I'm having a bit of trouble right now. Please try again, or reach out to us directly at **gloyas.connect@gmail.com** 💙",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatContent = (content: string) => {
    const cleaned = sanitizeContent(content);
    if (!cleaned) return '';

    return cleaned
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  const quickActions = [
    { label: '🎨 Services', prompt: 'What services do you offer?' },
    { label: '💰 Get Quote', prompt: 'I want to get a quote for a project' },
    { label: '⚡ Process', prompt: 'How does your process work?' },
    { label: '👥 Team', prompt: 'Tell me about your team' },
  ];

  return (
    <>
      {/* Floating Chat Button + Tooltip */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
          >
            {/* Tooltip */}
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="relative bg-white rounded-2xl shadow-xl border border-gray-200 px-4 py-3 max-w-[220px] cursor-pointer group"
                  onClick={() => { setShowTooltip(false); setIsOpen(true); }}
                >
                  <p className="text-[13px] text-gray-800 font-medium leading-snug">
                    Hi I&apos;m <span className="text-[#278DFD] font-bold">Stromy</span>. How can I help you today? 👋
                  </p>
                  {/* Close button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowTooltip(false); }}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    aria-label="Dismiss tooltip"
                  >
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="3" strokeLinecap="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                  {/* Arrow pointing down to the button */}
                  <div className="absolute -bottom-[6px] right-5 w-3 h-3 bg-white border-r border-b border-gray-200 rotate-45" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="w-[60px] h-[60px] rounded-full bg-[#278DFD] text-white shadow-2xl flex items-center justify-center hover:bg-[#2075D3] transition-colors duration-300 group cursor-pointer relative overflow-hidden"
              aria-label="Open chat assistant"
              id="ai-chat-toggle"
            >
              {/* Mascot Icon */}
              <Image
                src="https://cdn-img.streamletedge.com/6a6874155ad7d80e5dbcdb7b/images/gloyasagetnmascot-1790846259991.webp"
                alt="Stromy"
                width={48}
                height={48}
                className="object-contain group-hover:scale-110 transition-transform"
              />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-6 right-6 z-50 w-[calc(100vw-48px)] sm:w-[400px] h-[min(600px,calc(100vh-120px))] bg-white rounded-[24px] shadow-2xl border border-gray-200/80 flex flex-col overflow-hidden"
            id="ai-chat-panel"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#191A23] to-[#2a2b36] flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#278DFD] flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <Image
                    src="https://cdn-img.streamletedge.com/6a6874155ad7d80e5dbcdb7b/images/gloyasagetnmascot-1790846259991.webp"
                    alt="Stromy"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-white text-sm font-semibold tracking-tight">
                      Stromy
                    </h3>
                    {/* Animated dots beside Stromy in the header */}
                    {isLoading && (
                      <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#278DFD] animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#278DFD] animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#278DFD] animate-bounce" style={{ animationDelay: '300ms' }} />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isLoading ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#278DFD] animate-pulse" />
                        <span className="text-[11px] text-blue-300 font-medium">
                          Stromy is responding...
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[11px] text-gray-400 font-medium">
                          GLOYAS AI Assistant
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages Area */}
            <div
              ref={chatContainerRef}
              data-lenis-prevent
              className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 scroll-smooth"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#e5e7eb transparent',
                overscrollBehavior: 'contain',
              }}
            >
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex items-end gap-2 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {/* Stromy Avatar icon beside assistant messages */}
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-[#278DFD] flex items-center justify-center flex-shrink-0 overflow-hidden mb-0.5 shadow-sm">
                      <Image
                        src="https://cdn-img.streamletedge.com/6a6874155ad7d80e5dbcdb7b/images/gloyasagetnmascot-1790846259991.webp"
                        alt="Stromy"
                        width={22}
                        height={22}
                        className="object-contain"
                      />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] px-4 py-3 text-[13px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#278DFD] text-white rounded-[18px] rounded-br-[6px]'
                        : 'bg-gray-100 text-gray-800 rounded-[18px] rounded-bl-[6px]'
                    }`}
                  >
                    {formatContent(msg.content) ? (
                      <div>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: formatContent(msg.content),
                          }}
                        />
                        {/* Loading dots while streaming at the end of content */}
                        {msg.role === 'assistant' && isLoading && msg.id === messages[messages.length - 1]?.id && (
                          <div className="inline-flex items-center gap-1 mt-1.5 text-[#278DFD]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#278DFD] animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-[#278DFD] animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-[#278DFD] animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        )}
                      </div>
                    ) : null}
                    {msg.role === 'assistant' && !formatContent(msg.content) && (isLoading || isSubmittingQuote) && (
                      <div className="flex items-center gap-1.5 py-1 px-1">
                        <span className="w-2 h-2 rounded-full bg-[#278DFD] animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-[#278DFD] animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-[#278DFD] animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Quote Submitting Indicator */}
              {isSubmittingQuote && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex justify-center py-1.5"
                >
                  <div className="bg-blue-50 text-[#278DFD] border border-blue-200/80 rounded-full px-3.5 py-1 text-xs font-medium flex items-center gap-2 shadow-sm">
                    <div className="w-3 h-3 border-2 border-[#278DFD]/30 border-t-[#278DFD] rounded-full animate-spin" />
                    <span>Submitting inquiry to team...</span>
                  </div>
                </motion.div>
              )}

              {/* Quote submitted success pill */}
              {quoteSubmitted && !isSubmittingQuote && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center py-1.5"
                >
                  <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-3.5 py-1 text-xs font-medium flex items-center gap-1.5 shadow-sm">
                    <svg className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Inquiry sent! We&apos;ll be in touch soon.</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions (only show when few messages) */}
            {messages.length <= 1 && !isLoading && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5 flex-shrink-0">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => {
                      sendMessage(action.prompt);
                    }}
                    className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full text-[11px] font-medium text-gray-600 hover:text-gray-900 transition-all duration-200 cursor-pointer"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="px-4 pb-4 pt-2 border-t border-gray-100 flex-shrink-0">
              <div className="flex items-end gap-2 bg-gray-50 rounded-[16px] border border-gray-200 px-3 py-2 focus-within:border-[#278DFD] focus-within:ring-1 focus-within:ring-[#278DFD]/20 transition-all">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about our services..."
                  rows={1}
                  className="flex-1 bg-transparent text-[13px] text-gray-900 placeholder-gray-400 resize-none outline-none max-h-[80px] overflow-y-auto py-1"
                  disabled={isLoading}
                  id="ai-chat-input"
                  style={{ scrollbarWidth: 'none' }}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="w-8 h-8 rounded-full bg-[#278DFD] hover:bg-[#2075D3] disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0 transition-colors duration-200 cursor-pointer"
                  aria-label="Send message"
                  id="ai-chat-send"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={!input.trim() || isLoading ? '#9CA3AF' : 'white'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </button>
              </div>
              <p className="text-[10px] text-gray-400 text-center mt-2 font-medium">
                Powered by GLOYAS AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
