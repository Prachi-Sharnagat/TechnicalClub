import { SUGGESTED_QUESTIONS } from '../../lib/chatbotKnowledgeBase';

/**
 * SuggestedQuestions:
 * Reusable chip buttons for common inquiries.
 */
export default function SuggestedQuestions({
  questions = SUGGESTED_QUESTIONS,
  onSelect,
  title = '// SUGGESTED QUERIES'
}) {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="tc-suggest-box" aria-label="Suggested questions">
      {title && <span className="tc-suggest-heading">{title}</span>}
      <div className="tc-suggest-list">
        {questions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            className="tc-suggest-chip"
            onClick={() => onSelect(q)}
          >
            <span className="chip-prefix">&gt;</span> {q}
          </button>
        ))}
      </div>
    </div>
  );
}
