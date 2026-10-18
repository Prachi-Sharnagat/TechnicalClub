import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import SuggestedQuestions from './SuggestedQuestions';
import Px from '../graphics/Px';

/**
 * ChatbotPanel:
 * Main retro window interface for TC-BOT conversation.
 * Handles auto-scrolling, keyboard trap, and message flows.
 */
export default function ChatbotPanel({
  messages,
  isComputing,
  onSendMessage,
  onClearChat,
  onClose,
  panelRef,
  inputRef
}) {
  const scrollRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isComputing]);

  // Escape key listener to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Focus input on open
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef?.current?.focus();
    }, 150);
    return () => clearTimeout(timer);
  }, [inputRef]);

  return (
    <motion.aside
      ref={panelRef}
      className="win tc-panel-win"
      role="dialog"
      aria-label="TC-BOT Assistant"
      aria-modal="false"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.95 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Title Bar */}
      <div className="bar tc-panel-bar">
        <div className="tc-bar-left">
          <span className="tc-bar-led" aria-hidden="true" />
          <h2 className="tc-bar-title">TC-BOT // ASSISTANT</h2>
        </div>
        <div className="tc-bar-controls">
          <button
            type="button"
            className="tc-bar-btn"
            onClick={onClearChat}
            title="Reset conversation"
            aria-label="Clear chat conversation"
          >
            [CLEAR]
          </button>
          <button
            type="button"
            className="tc-bar-btn"
            onClick={onClose}
            title="Minimize"
            aria-label="Minimize chatbot"
          >
            [—]
          </button>
          <button
            type="button"
            className="tc-bar-btn tc-bar-close"
            onClick={onClose}
            title="Close"
            aria-label="Close chatbot"
          >
            [X]
          </button>
        </div>
      </div>

      {/* Subheader Status */}
      <div className="tc-panel-subheader">
        <span className="tc-sub-title">Your Technical Club RBU Assistant</span>
        <span className="tc-status-tag">ONLINE // READY</span>
      </div>

      {/* Scrollable Message History */}
      <div ref={scrollRef} className="tc-messages-container" tabIndex={0}>
        {messages.map((msg, index) => (
          <div key={msg.id || index} className="tc-msg-wrapper">
            <ChatMessage
              message={msg}
              onActionClick={onClose}
              onSuggestionClick={onSendMessage}
            />
            {/* Show suggested questions right below the initial welcome message if requested */}
            {msg.showSuggestions && index === 0 && (
              <SuggestedQuestions onSelect={onSendMessage} />
            )}
          </div>
        ))}

        {/* Computing indicator */}
        {isComputing && (
          <div className="tc-msg-row tc-msg-bot">
            <div className="tc-msg-avatar" aria-hidden="true">
              <div className="tc-bot-avatar-icon">
                <Px name="bot" />
              </div>
            </div>
            <div className="tc-msg-bubble tc-computing-bubble" aria-live="polite">
              <span className="tc-typing-spinner" aria-hidden="true" />
              <span className="tc-typing-text">TC-BOT IS COMPUTING...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Footer */}
      <div className="tc-panel-footer">
        <ChatInput
          onSendMessage={onSendMessage}
          isComputing={isComputing}
          inputRef={inputRef}
        />
      </div>
    </motion.aside>
  );
}
