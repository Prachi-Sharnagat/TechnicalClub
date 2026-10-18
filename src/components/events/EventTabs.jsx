import { useRef } from 'react';
import { motion } from 'framer-motion';
import { EVENT_CATEGORIES } from '../../data/events';
import { sm } from '../../lib/motion';

/**
 * EventTabs component:
 * Accessible, keyboard-navigable pixel-art tab list for:
 * - Ongoing Events
 * - Upcoming Events
 * - Past Events
 */
export default function EventTabs({ activeTab, onSelectTab, counts = {} }) {
  const tabRefs = useRef({});

  const handleKeyDown = (e, index) => {
    const total = EVENT_CATEGORIES.length;
    let nextIndex = null;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = (index + 1) % total;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = (index - 1 + total) % total;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = total - 1;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      const nextTab = EVENT_CATEGORIES[nextIndex];
      onSelectTab(nextTab.id);
      tabRefs.current[nextTab.id]?.focus();
    }
  };

  return (
    <div className="ev-tabs-container">
      <div
        className="ev-tablist"
        role="tablist"
        aria-label="Event categories"
      >
        {EVENT_CATEGORIES.map((tab, idx) => {
          const isActive = activeTab === tab.id;
          const count = counts[tab.id] ?? tab.count;

          return (
            <button
              key={tab.id}
              ref={(el) => (tabRefs.current[tab.id] = el)}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onSelectTab(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`ev-tab ${isActive ? 'active' : ''}`}
            >
              <span className="ev-tab-indicator" aria-hidden="true" />
              <span className="ev-tab-label">{tab.label}</span>
              {typeof count === 'number' && (
                <span className="ev-tab-count" aria-label={`${count} events`}>
                  [{count}]
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="ev-tab-active-glow"
                  transition={sm(0.25)}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
