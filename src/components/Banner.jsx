import AppLink from './AppLink';

export default function Banner({ title, text, cta }) {
  const isExternalAnchor = cta.target === '_blank' || (typeof cta.href === 'string' && cta.href.endsWith('.pdf'));

  return (
    <section className="banner" id="join">
      <div>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      {isExternalAnchor ? (
        <a
          className="btn go"
          href={cta.href}
          target={cta.target || '_blank'}
          rel={cta.rel || 'noopener noreferrer'}
          aria-label={cta.ariaLabel || cta.label}
        >
          {cta.label}
        </a>
      ) : (
        <AppLink className="btn go" href={cta.href}>
          {cta.label}
        </AppLink>
      )}
    </section>
  );
}
