export default function Nav({ links, cta }) {
  return (
    <nav>
      <a className="logo px" href="/">
        <img src="/technical-club-logo.png" alt="Technical Club RBU Logo" className="logo-img" />
        <span>TECHNICAL CLUB</span>
      </a>
      <ul>
        {links.map(([label, href]) => (
          <li key={label}>
            <a href={href}>{label}</a>
          </li>
        ))}
      </ul>
      <a className="btn" href={cta.href}>
        {cta.label}
      </a>
    </nav>
  );
}
