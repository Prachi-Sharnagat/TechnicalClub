import { motion } from 'framer-motion';
import { MODELLING } from '../data/modelling';
import DomainCards from '../components/graphics/DomainCards';
import JoinCta from '../components/graphics/JoinCta';
import Section from '../components/Section';
import Rows from '../components/Rows';
import Px from '../components/graphics/Px';
import { sm, tr } from '../lib/motion';
import ModellingArt from '../components/modelling/ModellingArt';

export default function ThreeDModellingPage() {
  const rows = MODELLING.path.map((p) => ({
    lead: <b>{p.lvl}</b>,
    title: p.title,
    text: p.text
  }));

  return (
    <div className="wrap">
      <section className="ghero ehero">
        <motion.div
          className="g-text"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={sm(0.7, 0.1)}
        >
          <div className="g-label">{MODELLING.label}</div>
          <h1>
            {MODELLING.title}
            <span className="cur" />
          </h1>
          <p>{MODELLING.intro}</p>
        </motion.div>
        <motion.div
          className="g-art"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={sm(0.9, 0.2)}
        >
          <ModellingArt />
        </motion.div>
        <motion.div
          className="g-btns"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={sm(0.7, 0.3)}
        >
          <motion.a className="btn go" href="#join" whileHover={{ y: -4, transition: tr(0.2) }}>
            JOIN 3D MODELLING
          </motion.a>
          <motion.a className="btn" href="#pipeline" whileHover={{ y: -4, transition: tr(0.2) }}>
            LEARN MORE <Px name="arrow" className="inl" />
          </motion.a>
        </motion.div>
      </section>

      <DomainCards services={MODELLING.services} title="WHAT WE DO" />

      <Section id="pipeline" title="3D Pipeline & Workflow Path">
        <Rows items={rows} />
      </Section>

      <JoinCta
        label="JOIN 3D MODELLING"
        kicker="// EXPLORE 3D VISUALIZATION & MODELLING"
        href="/register"
      />
    </div>
  );
}
