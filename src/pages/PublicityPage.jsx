import { motion } from 'framer-motion';
import { PUBLICITY } from '../data/publicity';
import DomainCards from '../components/graphics/DomainCards';
import JoinCta from '../components/graphics/JoinCta';
import Section from '../components/Section';
import Rows from '../components/Rows';
import Px from '../components/graphics/Px';
import { sm, tr } from '../lib/motion';
import posterArt from '../assets/pst4.webp';

export default function PublicityPage() {
  const rows = PUBLICITY.path.map((p) => ({
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
          <div className="g-label">{PUBLICITY.label}</div>
          <h1>
            {PUBLICITY.title}
            <span className="cur" />
          </h1>
          <p>{PUBLICITY.intro}</p>
        </motion.div>
        <motion.div
          className="g-art"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={sm(0.9, 0.2)}
        >
          <img
            src={posterArt}
            alt="Publicity Campaign Showcase"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85, border: '3px solid var(--line)' }}
          />
        </motion.div>
        <motion.div
          className="g-btns"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={sm(0.7, 0.3)}
        >
          <motion.a className="btn go" href="#join" whileHover={{ y: -4, transition: tr(0.2) }}>
            JOIN PUBLICITY
          </motion.a>
          <motion.a className="btn" href="#campaigns" whileHover={{ y: -4, transition: tr(0.2) }}>
            LEARN MORE <Px name="arrow" className="inl" />
          </motion.a>
        </motion.div>
      </section>

      <DomainCards services={PUBLICITY.services} title="WHAT WE DO" />

      <Section id="campaigns" title="Campaign & Growth Path">
        <Rows items={rows} />
      </Section>

      <JoinCta
        label="JOIN PUBLICITY"
        kicker="// AMPLIFY THE TECHNICAL CLUB VOICE"
        href="/register"
      />
    </div>
  );
}
