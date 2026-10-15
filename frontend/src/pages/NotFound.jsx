import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="section" style={{ textAlign: 'center', minHeight: '50vh' }}>
      <div className="container">
        <p className="mono-tag">404</p>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', margin: '10px 0 16px' }}>Page not found</h1>
        <p style={{ color: 'rgba(247,245,240,0.65)', marginBottom: '28px' }}>
          That page doesn't exist — but we can still fix your phone.
        </p>
        <Link to="/" className="btn btn--gold">
          Back to home
        </Link>
      </div>
    </section>
  );
}
