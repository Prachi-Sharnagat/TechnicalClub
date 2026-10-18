import { motion, useReducedMotion } from 'framer-motion';
import { FACULTY_COORDINATORS } from '../../data/faculty';
import FacultyCard from './FacultyCard';
import SecHead from '../graphics/SecHead';
import { sm } from '../../lib/motion';

export default function FacultySection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="faculty-section" aria-labelledby="faculty-coordinators-title">
      <div className="wrap">
        <motion.div
          className="faculty-header-block"
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={shouldReduceMotion ? { duration: 0 } : sm(0.5)}
        >
          <SecHead title="FACULTY COORDINATORS" />
          <p className="sec-intro faculty-subtitle">
            Guiding our technical vision, institutional mentorship, and student innovation at Technical Club RBU.
          </p>
        </motion.div>

        <div className="faculty-grid">
          {FACULTY_COORDINATORS.map((coordinator, i) => (
            <FacultyCard key={coordinator.id} coordinator={coordinator} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
