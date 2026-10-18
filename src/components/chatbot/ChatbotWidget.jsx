import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import ChatbotLauncher from './ChatbotLauncher';
import ChatbotPanel from './ChatbotPanel';
import { generateBotResponse } from '../../lib/chatbotIntentMatcher';
import {
  loadChatSession,
  saveChatSession,
  clearChatSession
} from '../../lib/chatSessionStorage';

/**
 * ChatbotWidget:
 * Master floating chatbot coordinator. Mounts in global layout.
 */
export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => loadChatSession());
  const [isComputing, setIsComputing] = useState(false);

  const launcherRef = useRef(null);
  const panelRef = useRef(null);
  const inputRef = useRef(null);

  // Sync to sessionStorage on update
  useEffect(() => {
    saveChatSession(messages);
  }, [messages]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClose = () => {
    setIsOpen(false);
    launcherRef.current?.focus();
  };

  const handleSendMessage = useCallback((text) => {
    if (!text || !text.trim()) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsComputing(true);

    // Realistic micro-delay simulating bot thinking and intent matching
    const timer = setTimeout(() => {
      const botReply = generateBotResponse(text);
      setMessages((prev) => [...prev, botReply]);
      setIsComputing(false);
    }, 380);

    return () => clearTimeout(timer);
  }, []);

  const handleClearChat = () => {
    const fresh = clearChatSession();
    setMessages(fresh);
    inputRef.current?.focus();
  };

  return (
    <div className="tc-chatbot-root">
      {/* Chatbot Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <ChatbotPanel
            messages={messages}
            isComputing={isComputing}
            onSendMessage={handleSendMessage}
            onClearChat={handleClearChat}
            onClose={handleClose}
            panelRef={panelRef}
            inputRef={inputRef}
          />
        )}
      </AnimatePresence>

      {/* Floating Bottom-Right Launcher */}
      <ChatbotLauncher
        isOpen={isOpen}
        onToggle={handleToggle}
        launcherRef={launcherRef}
      />
    </div>
  );
}
