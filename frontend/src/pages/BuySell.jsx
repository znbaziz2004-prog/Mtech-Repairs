import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { getProducts, submitSellRequest } from '../utils/api.js';
import { products as fallbackProducts } from '../data/fallback.js';
import useDocumentMeta from '../utils/useDocumentMeta.js';
import { useNavigate } from 'react-router-dom';
import './BuySell.css';

const conditions = ['All', 'New', 'Used', 'Refurbished'];

export default function BuySell() {
  const navigate = useNavigate();
  useDocumentMeta(
    'Buy & Sell | Mtech n repairs',
    'Buy new, used, and refurbished mobile devices, or sell your old device to Mtech n repairs for a fair valuation.'
  );

  const [products, setProducts] = useState(fallbackProducts);
  const [filter, setFilter] = useState('All');
  const [form, setForm] = useState({ name: '', brand: '', condition: 'Used', storage: '', color: '', description: '' });
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    let active = true;
    getProducts()
      .then((res) => {
        if (active && res.data?.data?.length) setProducts(res.data.data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const visible = filter === 'All' ? products : products.filter((p) => p.condition === filter);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await submitSellRequest(form);
      setStatus('sent');
      setForm({ name: '', brand: '', condition: 'Used', storage: '', color: '', description: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Buy & sell mobiles"
        title="New, used, and refurbished devices — bought and sold fairly."
        subtitle="Browse devices ready to go, or get a quote for the one you want to sell."
      />

      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="mono-tag">Available now</p>
            <h2 className="section-title">Devices in stock</h2>
          </div>

          <div className="filter-row">
            {conditions.map((c) => (
              <button
                key={c}
                className={`filter-pill ${filter === c ? 'is-active' : ''}`}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="product-grid">
            {visible.map((p) => (
              <div className="product-card" key={p.id || p.name + p.condition}>
  {p.image && (
    <div className="product-card__image">
      <img
        src={`http://localhost:5000${p.image}`}
        alt={p.name}
      />
    </div>
  )}

  <div className="product-card__top">
    <span className="product-card__condition">{p.condition}</span>
    <span className="mono-tag">£{p.price}</span>
  </div>

  <h3 className="product-card__name">{p.name}</h3>

  <p className="product-card__specs">
    {p.storage} {p.storage && p.color && '·'} {p.color}
  </p>

 <button
  className="btn btn--ghost product-card__btn"
  onClick={() => navigate(`/buy-sell/${p.id}`)}
>
  Enquire
</button>
</div>
            ))}
            {visible.length === 0 && <p className="product-empty">No devices match that filter right now.</p>}
          </div>
        </div>
      </section>

      <section className="section-tight sell-section">
        <div className="container sell-grid">
          <div>
            <p className="mono-tag">Sell to us</p>
            <h2 className="section-title">Got a device you want to sell?</h2>
            <p className="section-sub">
              Tell us about it and we'll get back to you with a fair offer — no obligation.
            </p>
          </div>

          <form className="sell-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label>
                Device name
                <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. iPhone 13" />
              </label>
              <label>
                Brand
                <input name="brand" value={form.brand} onChange={handleChange} required placeholder="e.g. Apple" />
              </label>
            </div>
            <div className="form-row">
              <label>
                Condition
                <select name="condition" value={form.condition} onChange={handleChange}>
                  <option>New</option>
                  <option>Used</option>
                  <option>Refurbished</option>
                </select>
              </label>
              <label>
                Storage
                <input name="storage" value={form.storage} onChange={handleChange} placeholder="e.g. 128GB" />
              </label>
            </div>
            <label>
              Color
              <input name="color" value={form.color} onChange={handleChange} placeholder="e.g. Midnight" />
            </label>
            <label>
              Anything else we should know?
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Condition details, accessories included, etc." />
            </label>
            <button type="submit" className="btn btn--gold" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Get a quote'}
            </button>
            {status === 'sent' && <p className="form-note form-note--ok">Thanks — we'll be in touch shortly.</p>}
            {status === 'error' && (
              <p className="form-note form-note--err">Couldn't send that just now — please try again or contact us directly.</p>
            )}
          </form>
        </div>
      </section>
    </>
  );
}
