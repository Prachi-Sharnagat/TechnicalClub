import { useState, useRef, useEffect } from 'react';
import Px from '../graphics/Px';

/**
 * ChatInput:
 * Accessible text input with Enter-to-send support,
 * character limit, and loading disabled state.
 */
export default function ChatInput({ onSendMessage, isComputing, inputRef }) {
  const [text, setText] = useState('');
  const localRef = useRef(null);
  const actualRef = inputRef || localRef;

  const handleSubmit = (e) => {
    e?.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isComputing) return;

    onSendMessage(trimmed);
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form className="tc-input-form" onSubmit={handleSubmit}>
      <div className="tc-input-box">
        <span className="tc-input-prompt" aria-hidden="true">&gt;</span>
        <input
          ref={actualRef}
          type="text"
          className="tc-text-input"
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 300))}
          onKeyDown={handleKeyDown}
          placeholder="Ask about domains, events, Robo Drive..."
          disabled={isComputing}
          maxLength={300}
          aria-label="Ask TC-BOT a question"
        />
        <button
          type="submit"
          className="btn go tc-send-btn"
          disabled={!text.trim() || isComputing}
          aria-label="Send question to TC-BOT"
        >
          SEND <Px name="arrow" className="inl" />
        </button>
      </div>
    </form>
  );
}
