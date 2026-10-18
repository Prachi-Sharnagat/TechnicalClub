import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { sm } from '../../lib/motion';

export default function FacultyCard({ coordinator, index }) {
  const [imgError, setImgError] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const photoSrc = coordinator.photo && !imgError
    ? (/^(https?:|data:|\/)/.test(coordinator.photo)
        ? coordinator.photo
        : `${import.meta.env.BASE_URL}${coordinator.photo}`)
    : null;

  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0 }
  };

  const isStudent = coordinator.type === 'student';

  return (
    <motion.article
      className={`faculty-card br ${isStudent ? 'student-coord' : 'faculty-mentor'}`}
      variants={cardVariants}
      initial={shouldReduceMotion ? 'visible' : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={shouldReduceMotion ? { duration: 0 } : sm(0.5, index * 0.12)}
    >
      <div className="faculty-card-top">
        <span className="faculty-slot-tag">// COORD {coordinator.slot}</span>
        <span className={`faculty-status-pill ${isStudent ? 'student' : 'faculty'}`}>
          {isStudent ? 'STUDENT LEAD' : 'FACULTY'}
        </span>
      </div>

      <div className="faculty-photo-frame">
        {photoSrc ? (
          <img
            src={photoSrc}
            alt={`Portrait of ${coordinator.name}`}
            className="faculty-photo-img"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="faculty-photo-fallback" aria-label={`Avatar for ${coordinator.name}`}>
            <svg className="faculty-icon-svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <rect x="6" y="2" width="4" height="4" />
              <rect x="5" y="3" width="6" height="2" />
              <rect x="4" y="6" width="8" height="2" />
              <rect x="3" y="8" width="10" height="7" />
              <rect x="2" y="10" width="12" height="5" />
              <rect x="5" y="6" width="6" height="1" fill="#080b16" />
              <rect x="7" y="8" width="2" height="4" fill="#080b16" />
            </svg>
            <span className="faculty-fallback-label">
              {isStudent ? '// STUDENT LEAD' : '// FACULTY MENTOR'}
            </span>
          </div>
        )}
      </div>

      <div className="faculty-info">
        <h3 className="faculty-name">{coordinator.name}</h3>
        <p className="faculty-role">{coordinator.designation}</p>

        {coordinator.department && (
          <div className="faculty-dept">
            <span className="faculty-meta-label">DEPT //</span>
            <span className="faculty-dept-val">{coordinator.department}</span>
          </div>
        )}

        {coordinator.academicYear && (
          <div className="faculty-dept faculty-year-row">
            <span className="faculty-meta-label">YEAR //</span>
            <span className="faculty-year-val">{coordinator.academicYear}</span>
          </div>
        )}

        {coordinator.email && (
          <div className="faculty-email-row">
            <span className="faculty-meta-label">EMAIL //</span>
            <a
              href={`mailto:${coordinator.email}`}
              className="faculty-email-link"
              title={`Send email to ${coordinator.email}`}
            >
              {coordinator.email}
            </a>
          </div>
        )}

        <div className="faculty-divider" />

        {coordinator.bio && (
          <p className="faculty-bio">{coordinator.bio}</p>
        )}
      </div>

      <div className="faculty-card-footer">
        {coordinator.email ? (
          <a
            href={`mailto:${coordinator.email}`}
            className="faculty-link-btn"
            aria-label={`Send email to ${coordinator.name} at ${coordinator.email}`}
          >
            <span>SEND EMAIL</span>
            <span className="faculty-link-arrow" aria-hidden="true">✉</span>
          </a>
        ) : coordinator.profileUrl ? (
          <a
            href={coordinator.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="faculty-link-btn"
            aria-label={`Official profile for ${coordinator.name}`}
          >
            <span>OFFICIAL PROFILE</span>
            <span className="faculty-link-arrow" aria-hidden="true">↗</span>
          </a>
        ) : (
          <span className="faculty-link-placeholder">
            {isStudent ? '[ STUDENT COORDINATOR ]' : '[ FACULTY MENTOR ]'}
          </span>
        )}
      </div>
    </motion.article>
  );
}
