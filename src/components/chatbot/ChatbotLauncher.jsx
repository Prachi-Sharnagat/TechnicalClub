import { motion } from 'framer-motion';
import { sm, tr } from '../../lib/motion';
import Px from '../graphics/Px';

/**
 * ChatbotLauncher:
 * Floating button at bottom-right triggering the TC-BOT panel.
 */
export default function ChatbotLauncher({ isOpen, onToggle, launcherRef }) {
  return (
    <motion.button
      ref={launcherRef}
      type="button"
      className={`tc-launcher-btn ${isOpen ? 'active' : ''}`}
      onClick={onToggle}
      aria-label={isOpen ? 'Close TC-BOT Assistant' : 'Open TC-BOT Assistant'}
      aria-expanded={isOpen}
      whileHover={{ y: -3, transition: tr(0.2) }}
      whileTap={{ y: 2 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={sm(0.4)}
    >
      <div className="tc-launcher-icon">
        <Px name="bot" />
        <span className="tc-launcher-led" aria-hidden="true" />
      </div>
      <span className="tc-launcher-label">
        {isOpen ? 'CLOSE [X]' : 'TC-BOT [CHAT]'}
      </span>
    </motion.button>
  );
}
