import { motion } from 'framer-motion';
import { WEBDEV } from '../data/webdev';
import useIntro from '../lib/useIntro';
import WebDevHero from '../components/WebDevHero';
import Section from '../components/Section';
import Rows from '../components/Rows';
import Banner from '../components/Banner';
import CodeIntro from '../components/CodeIntro';

export default function WebDevPage() {
  const [stage, run] = useIntro('web-dev', 950); // 'intro' (typing) -> 'reveal' (slides up) -> 'gone'
  const rows = WEBDEV.path.map((p) => ({ lead: <b>{p.lvl}</b>, title: p.title, text: p.text }));
  return (
    <>
      <div className="wrap">
        <WebDevHero ready={stage !== 'intro'} />
        <Section id="path" title="The learning path"><Rows items={rows} /></Section>
        <Section id="build" title="What we build">
          <div className="tags">{WEBDEV.projects.map((t) => <span key={t}>{t}</span>)}</div>
        </Section>
        <Banner
          title="Ready to write your first line?"
          text="No experience needed. Bring a laptop and curiosity."
          cta={{
            label: 'JOIN WEB DEV',
            href: '/web-dev-guide.pdf',
            target: '_blank',
            rel: 'noopener noreferrer'
          }}
        />
      </div>
      {stage !== 'gone' && (
        <motion.div className="overlay" initial={{ y: '0%' }} animate={{ y: stage === 'reveal' ? '-100%' : '0%' }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}>
          <CodeIntro onRun={run} />
        </motion.div>
      )}
    </>
  );
}
