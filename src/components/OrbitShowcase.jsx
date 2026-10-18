import { useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ORBITS, MEMBERS } from '../data/members';
import { sm } from '../lib/motion';
import Avatar from './Avatar';
import MemberInfo from './MemberInfo';

export default function OrbitShowcase() {
  const [active, setActive] = useState(0); // member shown in the centre
  const [paused, setPaused] = useState(false); // rings stop while a member is hovered / tapped
  const [line, setLine] = useState(null); // connector from member to centre
  const [viewMode, setViewMode] = useState('orbit'); // 'orbit' | 'roster' (for narrow screens)
  const stage = useRef(null);
  const nodes = useRef([]);
  const stripRef = useRef(null);

  // while paused, rings are frozen, so measure the member's spot and draw the connector
  useLayoutEffect(() => {
    if (!paused || viewMode === 'roster') return setLine(null);
    if (!stage.current) return;
    const s = stage.current.getBoundingClientRect();
    const n = nodes.current[active] && nodes.current[active].getBoundingClientRect();
    if (!n) return;
    const x = n.left + n.width / 2 - s.left;
    const y = n.top + n.height / 2 - s.top;
    const cx = s.width / 2, cy = s.height / 2;
    const d = Math.hypot(cx - x, cy - y) || 1;
    const ux = (cx - x) / d, uy = (cy - y) / d;
    const a = n.width * 0.68, b = s.width * 0.1;
    setLine({ x1: x + ux * a, y1: y + uy * a, x2: cx - ux * b, y2: cy - uy * b });
  }, [paused, active, viewMode]);

  const select = (id) => {
    setActive(id);
    setPaused(true);
    // Scroll thumbnail into view if strip is present
    const thumb = document.getElementById(`orbit-thumb-${id}`);
    if (thumb && stripRef.current) {
      thumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  const prevMember = () => select((active - 1 + MEMBERS.length) % MEMBERS.length);
  const nextMember = () => select((active + 1) % MEMBERS.length);

  const member = MEMBERS[active];

  return (
    <div className="orbit-page">
      {/* Mobile view switcher */}
      <div className="orbit-mobile-controls" role="toolbar" aria-label="Member view options">
        <div className="orbit-view-tabs">
          <button
            type="button"
            className={'orbit-tab-btn' + (viewMode === 'orbit' ? ' active' : '')}
            onClick={() => setViewMode('orbit')}
            aria-pressed={viewMode === 'orbit'}
          >
            ORBIT VIEW
          </button>
          <button
            type="button"
            className={'orbit-tab-btn' + (viewMode === 'roster' ? ' active' : '')}
            onClick={() => setViewMode('roster')}
            aria-pressed={viewMode === 'roster'}
          >
            MEMBER ROSTER
          </button>
        </div>
      </div>

      {viewMode === 'orbit' ? (
        <>
          <motion.div
            ref={stage}
            className={'orbit-stage' + (paused ? ' paused' : '')}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={sm(0.7)}
          >
            {ORBITS.map((r, ri) => (
              <div
                key={r.label}
                className="ring"
                style={{
                  '--d': r.radius * 2,
                  '--t': `${r.seconds}s`,
                  '--dir': r.dir === 'cw' ? 'normal' : 'reverse',
                  '--cdir': r.dir === 'cw' ? 'reverse' : 'normal'
                }}
              >
                {r.members.map((m, j) => {
                  const a = (j / r.members.length) * 2 * Math.PI + ri * 0.5;
                  return (
                    <div
                      key={m.id}
                      className={'slot' + (active === m.id ? ' on' : '')}
                      style={{ left: `${50 + 50 * Math.sin(a)}%`, top: `${50 - 50 * Math.cos(a)}%` }}
                    >
                      <div className="counter">
                        <button
                          ref={(el) => (nodes.current[m.id] = el)}
                          className="node"
                          aria-label={`${m.name}, ${m.role}`}
                          onPointerEnter={(e) => e.pointerType === 'mouse' && select(m.id)}
                          onPointerLeave={(e) => e.pointerType === 'mouse' && setPaused(false)}
                          onPointerUp={(e) => e.pointerType !== 'mouse' && (active === m.id && paused ? setPaused(false) : select(m.id))}
                          onFocus={() => select(m.id)}
                          onBlur={() => setPaused(false)}
                        >
                          <Avatar member={m} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

            {line && (
              <svg className="link" aria-hidden="true">
                <line {...line} />
              </svg>
            )}

            <div className="core">
              <motion.div key={active} className="core-in" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sm(0.3)}>
                <div className="core-av"><Avatar member={member} /></div>
                <div className="core-text"><MemberInfo member={member} /></div>
              </motion.div>
            </div>
          </motion.div>

          {/* Quick-step controls for narrow touchscreens */}
          <div className="orbit-step-bar" aria-label="Member pagination">
            <button
              type="button"
              className="btn orbit-nav-btn"
              onClick={prevMember}
              aria-label="Previous club member"
            >
              &lt; PREV
            </button>
            <span className="orbit-step-counter">
              {String(active + 1).padStart(2, '0')} / {String(MEMBERS.length).padStart(2, '0')}
            </span>
            <button
              type="button"
              className="btn orbit-nav-btn"
              onClick={nextMember}
              aria-label="Next club member"
            >
              NEXT &gt;
            </button>
          </div>

          {/* Horizontal touch strip of member avatars for accessible selection */}
          <div className="orbit-strip-container" ref={stripRef} aria-label="Member quick selector">
            <div className="orbit-strip">
              {MEMBERS.map((m) => (
                <button
                  key={m.id}
                  id={`orbit-thumb-${m.id}`}
                  type="button"
                  className={'orbit-thumb' + (active === m.id ? ' active' : '')}
                  onClick={() => select(m.id)}
                  aria-label={`Select ${m.name}`}
                  aria-pressed={active === m.id}
                >
                  <div className="orbit-thumb-av">
                    <Avatar member={m} />
                  </div>
                  <span className="orbit-thumb-name">{m.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile member profile card */}
          <div className="info-m" aria-live="polite">
            <MemberInfo member={member} />
          </div>

          <div className="foot2">
            <span className="hint"><i />HOVER / TAP A MEMBER</span>
            <span className="legend">{ORBITS.map((r) => <span key={r.label}>{r.label} ({r.dir.toUpperCase()})</span>)}</span>
          </div>
        </>
      ) : (
        /* Accessible Roster Grid Alternative View for narrow screens */
        <div className="orbit-roster-grid" role="region" aria-label="Full club member directory">
          {MEMBERS.map((m) => (
            <div key={m.id} className="orbit-roster-card">
              <div className="orbit-roster-top">
                <div className="orbit-roster-av">
                  <Avatar member={m} />
                </div>
                <div className="orbit-roster-header">
                  <h3 className="orbit-roster-name">{m.name}</h3>
                  <span className="orbit-roster-role">{m.role}</span>
                </div>
              </div>
              <p className="orbit-roster-bio">{m.bio}</p>
              {m.links && (
                <div className="orbit-roster-soc">
                  {Object.entries(m.links).map(([k, v]) => (
                    <a
                      key={k}
                      href={v ? (k === 'email' ? `mailto:${v}` : v) : undefined}
                      aria-label={`${m.name} ${k}`}
                      aria-disabled={!v}
                      target={v && k !== 'email' ? '_blank' : undefined}
                      rel={v && k !== 'email' ? 'noreferrer' : undefined}
                    >
                      {k[0].toUpperCase()}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

