import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Preloader from './components/Preloader.jsx';

import initInteractions from './utils/interactions.js';

import Home from './pages/Home.jsx';
import Repairs from './pages/Repairs.jsx';
import BuySell from './pages/BuySell.jsx';
import Accessories from './pages/Accessories.jsx';
import Diagnostics from './pages/Diagnostics.jsx';
import Book from './pages/Book.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import FAQ from './pages/FAQ.jsx';
import Reviews from './pages/Reviews.jsx';
import NotFound from './pages/NotFound.jsx';
import Cart from './pages/Cart.jsx';
import AccessoryDetails from './pages/AccessoryDetails.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Checkout from './pages/Checkout.jsx';
import PaymentSuccess from './pages/PaymentSuccess';

import { CartProvider } from './components/CartContext';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function PageTransition({ children }) {
  const { pathname } = useLocation();

  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  );
}

export default function App() {
  useEffect(() => {
    const cleanup = initInteractions();
    return cleanup;
  }, []);

  return (
    <CartProvider>
      <Preloader />

      <ScrollToTop />

      <Navbar />

      <main>
        <PageTransition>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/repairs" element={<Repairs />} />
            <Route path="/buy-sell" element={<BuySell />} />
            <Route path="/accessories" element={<Accessories />} />
            <Route path="/diagnostics" element={<Diagnostics />} />
            <Route path="/book" element={<Book />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/accessories/:id" element={<AccessoryDetails />} />
            <Route path="/buy-sell/:id" element={<ProductDetails />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
          </Routes>
        </PageTransition>
      </main>

      <Footer />
    </CartProvider>
  );
}