import { motion } from 'framer-motion';
import { sm } from '../../lib/motion';

/**
 * EventEmptyState:
 * Displays a polished pixel-themed empty state when a category has no events.
 * Specifically satisfies: "NEW EVENTS LOADING... STAY TUNED!"
 */
export default function EventEmptyState({
  title = 'NEW EVENTS LOADING... STAY TUNED!',
  message = 'The Technical Club crew is preparing the next round of hackathons, workshops, and build nights.',
  onSwitchCategory
}) {
  return (
    <motion.div
      className="win ev-empty"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={sm(0.5)}
    >
      <div className="bar">
        <i aria-hidden="true" />
        <span>TRANSMISSION // STATUS: STANDBY</span>
      </div>
      <div className="ev-empty-content">
        <div className="ev-empty-radar" aria-hidden="true">
          <div className="radar-sweep" />
          <span className="radar-dot dot-1" />
          <span className="radar-dot dot-2" />
        </div>
        <h3 className="ev-empty-title">{title}</h3>
        <p className="ev-empty-text">{message}</p>
        {onSwitchCategory && (
          <div className="ev-empty-actions">
            <button
              type="button"
              className="btn go"
              onClick={() => onSwitchCategory('ongoing')}
            >
              VIEW ONGOING EVENTS
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => onSwitchCategory('past')}
            >
              VIEW COMPLETED EVENTS
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
