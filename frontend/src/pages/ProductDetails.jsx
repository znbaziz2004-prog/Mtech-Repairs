import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProducts } from '../utils/api.js';
import { products as fallbackProducts } from '../data/fallback.js';
import useDocumentMeta from '../utils/useDocumentMeta.js';
import { useCart } from '../components/CartContext';
import './ProductDetails.css';

export default function ProductDetails() {
    const { addToCart } = useCart();
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  useDocumentMeta(
    product ? `${product.name} | Mtech n repairs` : 'Product Details | Mtech n repairs',
    product
      ? `View details and enquire about ${product.name}.`
      : 'View product details at Mtech n repairs.'
  );

  useEffect(() => {
    getProducts()
      .then((res) => {
        const apiProducts = res.data?.data || [];

        const found = apiProducts.find(
          (p) => String(p.id) === String(id)
        );

        if (found) {
          setProduct(found);
          return;
        }

        const fallback = fallbackProducts.find(
          (p) => String(p.id) === String(id)
        );

        setProduct(fallback || null);
      })
      .catch(() => {
        const fallback = fallbackProducts.find(
          (p) => String(p.id) === String(id)
        );

        setProduct(fallback || null);
      });
  }, [id]);

  if (!product) {
    return (
      <section className="section product-details-section">
        <div className="container">
          <div className="product-details-not-found">
            <h2>Product not found</h2>
            <p>This device is no longer available.</p>

            <button
              className="btn btn--gold"
              onClick={() => navigate('/buy-sell')}
            >
              Back to Buy & Sell
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section product-details-section">
      <div className="container">

        <button
          className="product-details-back"
          onClick={() => navigate('/buy-sell')}
        >
          ← Back to Buy & Sell
        </button>

        <div className="product-details">

          <div className="product-details-image">
            {product.image ? (
              <img
                src={`https://mtechnrepairs.hostless.app${product.image}`}
                alt={product.name}
              />
            ) : (
              <div className="product-details-no-image">
                No image available
              </div>
            )}
          </div>

          <div className="product-details-content">

            <span className="product-details-condition">
              {product.condition}
            </span>

            <h1>{product.name}</h1>

            <div className="product-details-price">
              £{product.price}
            </div>

            <div className="product-details-info">

              {product.brand && (
                <div>
                  <span>Brand</span>
                  <strong>{product.brand}</strong>
                </div>
              )}

              {product.storage && (
                <div>
                  <span>Storage</span>
                  <strong>{product.storage}</strong>
                </div>
              )}

              {product.color && (
                <div>
                  <span>Colour</span>
                  <strong>{product.color}</strong>
                </div>
              )}

              {product.stock !== undefined && (
                <div>
                  <span>Availability</span>
                  <strong>
                    {Number(product.stock) > 0
                      ? `${product.stock} in stock`
                      : 'Out of stock'}
                  </strong>
                </div>
              )}

            </div>

            {product.description && (
              <div className="product-details-description">
                <h3>Description</h3>
                <p>{product.description}</p>
              </div>
            )}

            <div className="product-details-actions">

              <button
                className="btn btn--gold"
                disabled={
                  product.stock !== undefined &&
                  Number(product.stock) <= 0
                }
               onClick={() => {
                console.log('ADD TO CART CLICKED');
  
addToCart({
  ...product,
  itemType: 'product',
});

  navigate('/cart');
}}
              >
                Add to Cart
              </button>

              <button
                className="btn btn--ghost"
                disabled={
                  product.stock !== undefined &&
                  Number(product.stock) <= 0
                }
                onClick={() => {
                  alert('Checkout connection will be added after Cart.');
                }}
              >
                Buy Now
              </button>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}