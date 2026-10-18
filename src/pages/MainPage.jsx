import { useEffect, useLayoutEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { SECTIONS } from '../lib/sections';
import usePageFlip from '../lib/usePageFlip';
import HomeSection from '../components/site/HomeSection';
import DomainsSection from '../components/site/DomainsSection';
import EventsSection from '../components/site/EventsSection';
import MembersSection from '../components/site/MembersSection';
import NextHint from '../components/site/NextHint';

const VIEWS = {
  home: HomeSection,
  domains: DomainsSection,
  members: MembersSection,
  events: EventsSection
};

const variants = {
  enter: (dir) => ({ opacity: 0, y: dir >= 0 ? 60 : -60 }),
  center: { opacity: 1, y: 0 },
  exit: (dir) => ({ opacity: 0, y: dir >= 0 ? -60 : 60 })
};

// A single page of the main site. When we arrive from the page below (scrolling up),
// start at its bottom so the scroll feels continuous.
function Page({ id, dir, children }) {
  useLayoutEffect(() => {
    const place = () => window.scrollTo(0, dir < 0 ? document.documentElement.scrollHeight : 0);
    place();
    const r = requestAnimationFrame(place);
    return () => cancelAnimationFrame(r);
  }, [dir]);
  return (
    <motion.section
      id={id}
      className="main-sec"
      custom={dir}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}

// Home -> Domains -> Members -> Events, each its own page with its own route (/, /domains, /members, /events).
// Scroll a page to its end and the next page opens. Scroll up past the top and the previous one opens.
export default function MainPage() {
  const { pathname, state } = useLocation();
  const navigate = useNavigate();
  const index = SECTIONS.findIndex((s) => s.path === pathname);
  const dir = (state && state.dir) || 0; // 1 = came from the page above, -1 = from the page below

  useEffect(() => {
    document.documentElement.classList.add('paged');
    return () => document.documentElement.classList.remove('paged');
  }, []);
  useEffect(() => { if (index < 0) navigate('/', { replace: true }); }, [index, navigate]); // unknown address -> home

  const go = (d) => navigate(SECTIONS[index + d].path, { state: { dir: d } });
  usePageFlip({
    resetKey: pathname,
    next: index >= 0 && index < SECTIONS.length - 1 ? () => go(1) : null,
    prev: index > 0 ? () => go(-1) : null
  });

  if (index < 0) return null;
  const section = SECTIONS[index];
  const View = VIEWS[section.id];
  const upcoming = SECTIONS[index + 1];

  return (
    <AnimatePresence mode="wait" initial={false} custom={dir}>
      <Page key={section.id} id={section.id} dir={dir}>
        <View />
        {upcoming && <NextHint label={upcoming.label} onClick={() => go(1)} />}
      </Page>
    </AnimatePresence>
  );
}
