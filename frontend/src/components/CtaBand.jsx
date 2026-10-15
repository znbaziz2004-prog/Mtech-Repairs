import { Link } from 'react-router-dom';
import Reveal from './Reveal.jsx';
import './CtaBand.css';

export default function CtaBand({
  title = "Got a device that's acting up?",
  sub = 'Book a slot and get a straight answer — and a straight quote — before we touch anything.',
}) {
  return (
    <section className="cta-band">
      <Reveal className="container cta-band__inner">
        <div>
          <h2 className="cta-band__title">{title}</h2>
          <p className="cta-band__sub">{sub}</p>
        </div>
        <Link to="/book" className="btn btn--gold">
          Book a repair
        </Link>
      </Reveal>
    </section>
  );
}
