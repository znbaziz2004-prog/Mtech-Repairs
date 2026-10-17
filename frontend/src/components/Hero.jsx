import { Link } from 'react-router-dom';
import Reveal from './Reveal.jsx';
import AnimatedCounter from './AnimatedCounter.jsx';
import './Hero.css';

const floatingBadges = ['Board Level Repairs', 'Microsoldering', 'IC Work', 'Level 3 & Level 4'];

export default function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero__panel">
          {/* soft background (parallax target) */}
          <div className="hero__backdrop" aria-hidden="true">
            <span className="hero__orb hero__orb--a" />
            <span className="hero__orb hero__orb--b" />
          </div>
          <div className="hero__grid-bg" aria-hidden="true" />

          <div className="hero__layout">
            {/* LEFT: text */}
            <div className="hero__content">
              <Reveal>
                <span className="hero__badge">
                  <i className="hero__badge-dot" /> Level 3 &amp; Level 4 Specialist
                </span>
              </Reveal>

              <Reveal delay={80}>
                <h1 className="hero__title">
                  Professional mobile repairs.
                  <br />
                  <span className="hero__title-accent">Built on real expertise.</span>
                </h1>
              </Reveal>

              <Reveal delay={140}>
                <p className="hero__sub">
                  From everyday screen repairs to advanced board-level diagnostics,
                  Mtech n repairs provides professional mobile technology solutions
                  you can trust.
                </p>
              </Reveal>

              <Reveal delay={200}>
                <div className="hero__console" aria-hidden="true">
                  <div className="hero__console-bar">
                    <i /><i /><i />
                    <span>mtech-diagnostics</span>
                  </div>
                  <div className="hero__console-body">
                    <span className="hero__console-line" style={{ '--n': 29, '--d': '0.8s' }}>
                      &gt; scanning logic board... <b>OK</b>
                    </span>
                    <span className="hero__console-line" style={{ '--n': 26, '--d': '2s' }}>
                      &gt; checking power IC... <b>OK</b>
                    </span>
                    <span className="hero__console-line" style={{ '--n': 22, '--d': '3.2s' }}>
                      &gt; repair ready in <em>24h</em>
                    </span>
                    <span className="hero__caret" />
                  </div>
                </div>
              </Reveal>

              <Reveal delay={260}>
                <div className="hero__actions">
                  <Link to="/book" className="btn btn--gold">
                    Book a repair
                  </Link>
                  <Link to="/repairs" className="btn btn--ghost-light">
                    Explore our services
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={320}>
                <div className="hero__floaters">
                  {floatingBadges.map((b, i) => (
                    <span className="hero__floater" style={{ animationDelay: `${i * 0.6}s` }} key={b}>
                      {b}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* RIGHT: logo */}
            <div className="hero__art" aria-hidden="true">
              <div className="hero__art-inner">
                <span className="hero__art-beam" />
                <span className="hero__art-glow" />
                <span className="hero__art-ring" />
                <img src="/assets/logo-mark.png" alt="" className="hero__logo" />
                <span className="hero__chip hero__chip--a">Level 3</span>
                <span className="hero__chip hero__chip--b">Level 4</span>
              </div>
            </div>
          </div>
        </div>

        <Reveal delay={320}>
          <div className="hero__stats">
            <div>
              <span className="hero__stat-num"><AnimatedCounter value={4} /></span>
              <span className="hero__stat-label">Repair levels, 1–4</span>
            </div>
            <div>
              <span className="hero__stat-num"><AnimatedCounter value={20} suffix="+" /></span>
              <span className="hero__stat-label">Device types serviced</span>
            </div>
            <div>
              <span className="hero__stat-num"><AnimatedCounter value={24} suffix="h" /></span>
              <span className="hero__stat-label">Typical turnaround</span>
            </div>
            <div>
              <span className="hero__stat-num"><AnimatedCounter value={4.9} decimals={1} /></span>
              <span className="hero__stat-label">Average customer rating</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}