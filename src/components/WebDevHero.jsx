import { motion } from 'framer-motion';
import { sm } from '../lib/motion';
import { WEBDEV } from '../data/webdev';
import Window from './Window';

// `ready` flips to true when the intro overlay starts leaving, which starts the entrance animations.
export default function WebDevHero({ ready }) {
  return (
    <section className="wd-hero">
      <div>
        <motion.h1 initial={{ opacity: 0, y: -30 }} animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }} transition={sm(0.7, 0.25)}>
          Web Dev Domain
          <span className="cur" />
        </motion.h1>
        <motion.p className="lead" initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={sm(0.7, 0.4)}>
          {WEBDEV.intro}
        </motion.p>
        <motion.div className="cta" initial={{ opacity: 0, y: 16 }} animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }} transition={sm(0.7, 0.55)}>
          <a
            className="btn go"
            href="/web-dev-guide.pdf"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Join Web Dev - Opens recruitment task guide PDF in new tab"
          >
            JOIN WEB DEV
          </a>
          <a className="btn" href="#path">
            SEE THE PATH
          </a>
        </motion.div>
      </div>

      <Window
        title="technicalclub.dev"
        initial={{ opacity: 0, x: 60 }}
        animate={ready ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
        transition={sm(0.9, 0.3)}
      >
        <div className="mock">
          <h3>Hello, world!</h3>
          <div className="blk" />
          <div className="blk" />
          <div className="blk s" />
          <span className="btn go">LAUNCH</span>
        </div>
      </Window>
    </section>
  );
}
