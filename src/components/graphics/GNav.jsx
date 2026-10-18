import { useState } from 'react';
import Px from './Px';

export default function GNav({ links, cta = { label: 'JOIN', href: '#join' } }) {
  const [open, setOpen] = useState(false);
  const items = (onClick) =>
    links.map(([label, href, on]) => (
      <li key={label}>
        <a href={href} className={on ? 'on' : undefined} onClick={onClick}>{label}</a>
      </li>
    ));
  return (
    <header className="gnav">
      <div className="wrap">
        <div className="gnav-bar">
          <a className="logo px" href="/"><img src="/technical-club-logo.png" alt="Technical Club RBU Logo" className="logo-img" />TECHNICAL CLUB</a>
          <ul className="glinks">{items()}</ul>
          <a className="btn gjoin" href={cta.href}>{cta.label}</a>
          <button className="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}><Px name="menu" /></button>
        </div>
        {open && (
          <ul className="gmenu">
            {items(() => setOpen(false))}
            <li><a className="btn go" href={cta.href} onClick={() => setOpen(false)}>{cta.label}</a></li>
          </ul>
        )}
      </div>
    </header>
  );
}
