import { HOME } from '../../data/home';
import HomeHero from '../HomeHero';
import HomeAbout from '../HomeAbout';
import Strip from '../Strip';
import Section from '../Section';
import Rows from '../Rows';
import PixelIcon from '../PixelIcon';
export default function HomeSection() {
  const rows = HOME.pillars.map((p) => ({ lead: <PixelIcon name={p.name} />, title: p.name, text: p.text }));
  return (
    <>
      <div className="wrap">
        <HomeHero />
        <HomeAbout />
      </div>
      <Strip items={HOME.strip} />
      <div className="wrap">
        <Section id="do" title="What we do"><Rows items={rows} /></Section>
      </div>
    </>
  );
}
