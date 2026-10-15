
import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

const getItemType = (item) => item.itemType || 'accessory';

const isSameItem = (a, b) =>
  String(a.id) === String(b.id) &&
  getItemType(a) === getItemType(b);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('mtech_cart');
      const items = saved ? JSON.parse(saved) : [];

      if (!Array.isArray(items)) return [];

      return items.map((item) => ({
        ...item,
        itemType: getItemType(item),
      }));
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('mtech_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    const newItem = {
      ...item,
      itemType: getItemType(item),
    };

    setCart((current) => {
      const existing = current.find((x) => isSameItem(x, newItem));

      if (existing) {
        return current.map((x) =>
          isSameItem(x, newItem)
            ? { ...x, quantity: x.quantity + 1 }
            : x
        );
      }

      return [...current, { ...newItem, quantity: 1 }];
    });
  };

  const removeFromCart = (id, itemType = 'accessory') => {
    setCart((current) =>
      current.filter(
        (item) =>
          !(
            String(item.id) === String(id) &&
            getItemType(item) === itemType
          )
      )
    );
  };

  const updateQuantity = (id, quantity, itemType = 'accessory') => {
    if (quantity < 1) {
      removeFromCart(id, itemType);
      return;
    }

    setCart((current) =>
      current.map((item) =>
        String(item.id) === String(id) &&
        getItemType(item) === itemType
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) =>
      total + Number(item.price || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
