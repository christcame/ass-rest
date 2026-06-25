import { LINKS } from "./links";

export default function Home() {
  return (
    <main className="page">
      <div className="card">
        <div className="avatar" aria-hidden="true">
          {/* Placeholder avatar — drop a real <Image /> here later */}
          <span>A</span>
        </div>

        <h1 className="name">ass.rest</h1>
        <p className="tagline">one link to find them all</p>

        <ul className="links" role="list">
          {LINKS.filter((l) => l.href).map((link) => (
            <li key={link.href}>
              <a
                className="link-button"
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.icon && <span className="link-icon">{link.icon}</span>}
                <span className="link-text">
                  <span className="link-label">{link.label}</span>
                  {link.description && (
                    <span className="link-description">{link.description}</span>
                  )}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <footer className="footer">
          <span>deployed on vercel</span>
        </footer>
      </div>
    </main>
  );
}
