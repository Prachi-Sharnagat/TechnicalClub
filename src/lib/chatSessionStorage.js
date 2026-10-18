import { INITIAL_GREETING } from './chatbotKnowledgeBase';

const STORAGE_KEY = 'tc_bot_session_history_v1';
const MAX_STORED_MESSAGES = 40;

/**
 * Load conversation history from sessionStorage.
 * Validates message format and falls back gracefully.
 */
export function loadChatSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [INITIAL_GREETING];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [INITIAL_GREETING];
    }

    // Basic schema validation to protect against malformed data
    const isValid = parsed.every(
      (m) => m && typeof m.text === 'string' && (m.sender === 'bot' || m.sender === 'user')
    );

    if (!isValid) {
      return [INITIAL_GREETING];
    }

    return parsed;
  } catch (err) {
    console.warn('TC-BOT: Could not load chat session from sessionStorage:', err);
    return [INITIAL_GREETING];
  }
}

/**
 * Save conversation history to sessionStorage.
 * Truncates oldest messages beyond limit to prevent storage quota issues.
 */
export function saveChatSession(messages) {
  if (!Array.isArray(messages)) return;

  try {
    const trimmed = messages.slice(-MAX_STORED_MESSAGES);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (err) {
    console.warn('TC-BOT: Could not save chat session to sessionStorage:', err);
  }
}

/**
 * Clear conversation history from sessionStorage and return fresh greeting.
 */
export function clearChatSession() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('TC-BOT: Could not clear chat session from sessionStorage:', err);
  }
  return [INITIAL_GREETING];
}
