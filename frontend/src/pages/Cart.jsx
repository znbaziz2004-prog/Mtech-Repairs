import { Link } from 'react-router-dom';
import { useCart } from '../components/CartContext';
import './Cart.css';

export default function Cart() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal,
  } = useCart();

  if (cart.length === 0) {
    return (
      <section className="section cart-page">
        <div className="container cart-empty">
          <h1>Your Cart is Empty</h1>
          <p>Add some accessories to your cart and come back here.</p>

          <Link to="/accessories" className="btn">
            Browse Accessories
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section cart-page">
      <div className="container">
        <div className="cart-header">
          <span className="cart-eyebrow">Your Cart</span>
          <h1>Accessories</h1>
          <p>Review your items before checkout.</p>
        </div>

        <div className="cart-layout">

          <div className="cart-items">
            {cart.map((item) => {
              const itemTotal =
                Number(item.price || 0) * item.quantity;

              return (
                <div
  className="cart-item"
  key={`${item.itemType || 'accessory'}-${item.id}`}
>

                  <div className="cart-item__image">
                    {item.image ? (
                      <img
                        src={
                          item.image.startsWith('http')
                            ? item.image
                            : `http://localhost:5000${item.image}`
                        }
                        alt={item.name}
                      />
                    ) : (
                      <div className="cart-item__placeholder">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="cart-item__info">
                    <span className="cart-item__category">
                      {item.category}
                    </span>

                    <h3>{item.name}</h3>

                    <p>£{Number(item.price).toFixed(2)} each</p>

                    <div className="cart-item__bottom">

                      <div className="quantity-control">
                        <button
                          type="button"
                         onClick={() =>
  updateQuantity(
    item.id,
    item.quantity - 1,
    item.itemType || 'accessory'
  )
}
                        >
                          −
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          type="button"
                          onClick={() =>
  updateQuantity(
    item.id,
    item.quantity + 1,
    item.itemType || 'accessory'
  )
}
                        >
                          +
                        </button>
                      </div>

                      <strong>
                        £{itemTotal.toFixed(2)}
                      </strong>

                    </div>

                    <button
                      type="button"
                      className="cart-remove"
                     onClick={() =>
  removeFromCart(
    item.id,
    item.itemType || 'accessory'
  )
}
                    >
                      Remove
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          <aside className="cart-summary">
            <h2>Order Summary</h2>

            <div className="cart-summary__row">
              <span>Items</span>
              <span>
                {cart.reduce(
                  (total, item) => total + item.quantity,
                  0
                )}
              </span>
            </div>

            <div className="cart-summary__row cart-summary__total">
              <span>Total</span>
              <strong>
                £{Number(cartTotal).toFixed(2)}
              </strong>
            </div>

            <Link
              to="/checkout"
              className="btn cart-checkout"
            >
              Checkout
            </Link>

            <Link
              to="/accessories"
              className="cart-continue"
            >
              Continue Shopping
            </Link>
          </aside>

        </div>
      </div>
    </section>
  );
}