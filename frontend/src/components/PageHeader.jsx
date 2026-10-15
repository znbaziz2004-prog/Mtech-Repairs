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
        </div>
      </div>
    </section>
  );
}
