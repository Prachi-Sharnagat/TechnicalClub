import { Link } from 'react-router-dom';
import Px from '../graphics/Px';

/**
 * ChatMessage:
 * Individual message bubble in retro pixel terminal styling.
 * Displays avatar, formatted text, timestamp, and optional interactive action pills.
 */
export default function ChatMessage({ message, onActionClick, onSuggestionClick }) {
  const isBot = message.sender === 'bot';

  // Format message lines into readable blocks
  const lines = (message.text || '').split('\n').filter((l) => l.trim().length > 0);

  return (
    <div className={`tc-msg-row ${isBot ? 'tc-msg-bot' : 'tc-msg-user'}`}>
      {/* Avatar */}
      <div className="tc-msg-avatar" aria-hidden="true">
        {isBot ? (
          <div className="tc-bot-avatar-icon">
            <Px name="bot" />
          </div>
        ) : (
          <div className="tc-user-avatar-icon">
            <span className="user-icon-txt">YOU</span>
          </div>
        )}
      </div>

      {/* Message Bubble */}
      <div className="tc-msg-bubble">
        <div className="tc-msg-header">
          <span className="tc-msg-sender">{isBot ? 'TC-BOT' : 'YOU'}</span>
          {message.timestamp && (
            <span className="tc-msg-time">{message.timestamp}</span>
          )}
        </div>

        <div className="tc-msg-body">
          {lines.map((line, idx) => {
            const isBullet = line.startsWith('•') || line.startsWith('-');
            const isNumbered = /^\d+\./.test(line);

            return (
              <p
                key={idx}
                className={`tc-msg-line ${isBullet ? 'tc-bullet-line' : ''} ${isNumbered ? 'tc-num-line' : ''}`}
              >
                {line}
              </p>
            );
          })}
        </div>

        {/* Action Navigation Buttons */}
        {isBot && message.actions && message.actions.length > 0 && (
          <div className="tc-msg-actions">
            {message.actions.map((act, idx) => {
              if (act.isInternal && act.path) {
                return (
                  <Link
                    key={idx}
                    to={act.path}
                    className="tc-action-btn"
                    onClick={() => onActionClick?.(act.path)}
                  >
                    {act.label} <span className="tc-act-arrow">→</span>
                  </Link>
                );
              }
              return (
                <a
                  key={idx}
                  href={act.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tc-action-btn tc-action-external"
                >
                  {act.label} <Px name="arrow" className="inl ext" />
                </a>
              );
            })}
          </div>
        )}

        {/* Dynamic Follow-up Suggestions */}
        {isBot && message.followUps && message.followUps.length > 0 && (
          <div className="tc-followups">
            <span className="tc-followup-title">QUICK FOLLOW-UPS:</span>
            <div className="tc-followup-chips">
              {message.followUps.map((fu, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="tc-followup-chip"
                  onClick={() => onSuggestionClick?.(fu)}
                >
                  {fu}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
