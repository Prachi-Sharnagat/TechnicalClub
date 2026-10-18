import Nav from '../components/Nav';
import FacultySection from '../components/members/FacultySection';
import OrbitShowcase from '../components/OrbitShowcase';
import SecHead from '../components/graphics/SecHead';
import Footer from '../components/Footer';

export default function MembersPage() {
  return (
    <>
      <div className="wrap">
        <Nav links={[['Home', 'index.html'], ['Web Dev', 'webdev.html'], ['Events', 'events.html']]} cta={{ label: 'JOIN', href: '#' }} />
      </div>
      <FacultySection />
      <div className="wrap orbit-sec-head">
        <SecHead title="STUDENT CORE & ORBIT" />
      </div>
      <OrbitShowcase />
      <Footer text="Technical Club. Meet the crew." />
    </>
  );
}
