import FacultySection from '../members/FacultySection';
import OrbitShowcase from '../OrbitShowcase';
import SecHead from '../graphics/SecHead';

export default function MembersSection() {
  return (
    <div className="members-flow-container">
      {/* 1. Faculty Coordinators Section at the very top */}
      <FacultySection />

      {/* 2. Existing interactive member-orbit section */}
      <div className="orbit-section-wrap">
        <div className="wrap orbit-sec-head">
          <SecHead title="STUDENT CORE & ORBIT" />
          <p className="sec-intro orbit-subtitle">
            Explore our multidisciplinary student builders, engineers, and creatives across the club rings.
          </p>
        </div>
        <OrbitShowcase />
      </div>
    </div>
  );
}
