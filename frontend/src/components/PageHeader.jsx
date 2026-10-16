import Reveal from './Reveal.jsx';
import './PageHeader.css';

export default function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <section className="page-header">
      <div className="container">
        <div className="page-header__panel">
          <Reveal className="page-header__inner">
            {eyebrow && <p className="mono-tag">{eyebrow}</p>}
            <h1 className="page-header__title">{title}</h1>
            {subtitle && <p className="page-header__sub">{subtitle}</p>}
          </Reveal>

          <div className="page-header__art" aria-hidden="true">
            <div className="page-header__art-inner">
              <span className="page-header__beam" />
              <span className="page-header__glow" />
              <span className="page-header__ring" />
              <img className="page-header__logo" src="/assets/logo-mark.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
