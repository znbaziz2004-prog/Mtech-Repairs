import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import PageHeader from '../components/PageHeader.jsx';
import CtaBand from '../components/CtaBand.jsx';

import { getAccessories } from '../utils/api.js';
import { accessories as fallback } from '../data/fallback.js';
import { useCart } from '../components/CartContext';
import useDocumentMeta from '../utils/useDocumentMeta.js';

import './Accessories.css';

const categories = [
  'All',
  'Chargers',
  'Cables',
  'Cases',
  'Screen Protectors',
  'Audio',
];

export default function Accessories() {
  useDocumentMeta(
    'Accessories | Mtech n repairs',
    'Chargers, cables, cases, screen protectors, and more — accessories from Mtech n repairs.'
  );

  const [items, setItems] = useState(fallback);
  const [filter, setFilter] = useState('All');

  const { addToCart } = useCart();

  useEffect(() => {
    let active = true;

    getAccessories()
      .then((res) => {
        if (active && res.data?.data?.length) {
          setItems(res.data.data);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const visible =
    filter === 'All'
      ? items
      : items.filter((a) => a.category === filter);

  return (
    <>
      <PageHeader
        eyebrow="Accessories"
        title="Chargers, cables, cases & more."
        subtitle="Everyday essentials to keep your devices charged, protected, and looking good."
      />

      <section className="section">
        <div className="container">

          <div className="filter-row">
            {categories.map((c) => (
              <button
                key={c}
                className={`filter-pill ${
                  filter === c ? 'is-active' : ''
                }`}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="acc-grid">

            {visible.map((a) => (
              <Link
                to={`/accessories/${a.id}`}
                className="acc-card"
                key={a.id || a.name}
              >

                {a.image && (
                  <div className="acc-card__image">
                    <img
                      src={
                        a.image.startsWith('http')
                          ? a.image
                          : `http://localhost:5000${a.image}`
                      }
                      alt={a.name}
                    />
                  </div>
                )}

                <span className="acc-card__cat">
                  {a.category}
                </span>

                <h3 className="acc-card__name">
                  {a.name}
                </h3>

                <span className="mono-tag">
                  £{a.price}
                </span>

                <button
                  type="button"
                  className="btn acc-card__cart-btn"
                  onClick={(e) => {
                    e.preventDefault();

                    addToCart({
                      id: a.id,
                      itemType: 'accessory',
                      name: a.name,
                      price: a.price,
                      image: a.image,
                      category: a.category,
                    });
                  }}
                >
                  Add to Cart
                </button>

              </Link>
            ))}

          </div>

        </div>
      </section>

      <CtaBand
        title="Need it fitted, not just sold?"
        sub="We'll fit screen protectors and check your charging port while you wait."
      />
    </>
  );
}