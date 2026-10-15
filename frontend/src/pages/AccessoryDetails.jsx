import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAccessories } from '../utils/api.js';
import { accessories as fallback } from '../data/fallback.js';
import { useCart } from '../components/CartContext';
import useDocumentMeta from '../utils/useDocumentMeta.js';

import './AccessoryDetails.css';

export default function AccessoryDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [accessory, setAccessory] = useState(null);
  const [loading, setLoading] = useState(true);

  useDocumentMeta(
    accessory
      ? `${accessory.name} | Mtech n repairs`
      : 'Accessory Details | Mtech n repairs',
    accessory?.description || 'Accessory details from Mtech n repairs.'
  );

  useEffect(() => {
    let active = true;

    getAccessories()
      .then((res) => {
        if (!active) return;

        const items = res.data?.data || [];
        const found = items.find(
          (item) => String(item.id) === String(id)
        );

        setAccessory(found || null);
      })
      .catch(() => {
        const found = fallback.find(
          (item) => String(item.id) === String(id)
        );

        if (active) {
          setAccessory(found || null);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <section className="section accessory-details">
        <div className="container">
          <p>Loading accessory...</p>
        </div>
      </section>
    );
  }

  if (!accessory) {
    return (
      <section className="section accessory-details">
        <div className="container accessory-not-found">
          <h1>Accessory Not Found</h1>
          <p>
            Sorry, this accessory is no longer available.
          </p>

          <Link to="/accessories" className="btn">
            Back to Accessories
          </Link>
        </div>
      </section>
    );
  }

  const imageUrl = accessory.image
    ? accessory.image.startsWith('http')
      ? accessory.image
      : `http://localhost:5000${accessory.image}`
    : '';

  return (
    <section className="section accessory-details">
      <div className="container">

        <Link
          to="/accessories"
          className="accessory-details__back"
        >
          ← Back to Accessories
        </Link>

        <div className="accessory-details__grid">

          <div className="accessory-details__image">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={accessory.name}
              />
            ) : (
              <div className="accessory-details__no-image">
                No Image
              </div>
            )}
          </div>

          <div className="accessory-details__content">

            <span className="accessory-details__category">
              {accessory.category}
            </span>

            <h1>{accessory.name}</h1>

            <div className="accessory-details__price">
              £{Number(accessory.price || 0).toFixed(2)}
            </div>

            {accessory.description && (
              <p className="accessory-details__description">
                {accessory.description}
              </p>
            )}

            <div className="accessory-details__actions">
              <button
                type="button"
                className="btn accessory-details__cart"
                onClick={() =>
                  addToCart({
                    id: accessory.id,
                    itemType: 'accessory',
                    name: accessory.name,
                    price: accessory.price,
                    image: accessory.image,
                    category: accessory.category,
                  })
                }
              >
                Add to Cart
              </button>

              <Link
                to="/cart"
                className="accessory-details__view-cart"
              >
                View Cart
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}