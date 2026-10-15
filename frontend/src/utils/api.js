import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

export const createBooking = (payload) => api.post('/bookings', payload);
export const getDevices = (params) => api.get('/devices', { params });
export const getServices = (params) => api.get('/services', { params });
export const getProducts = (params) => api.get('/products', { params });
export const submitSellRequest = (payload) => api.post('/products/sell-request', payload);
export const getAccessories = (params) => api.get('/accessories', { params });
export const sendContactMessage = (payload) => api.post('/contact', payload);
export const getTestimonials = () => api.get('/testimonials');
export const createOrder = (payload) => api.post('/orders', payload);

export const createStripeCheckoutSession = (payload) =>
  api.post('/payments/create-checkout-session', payload);


export const verifyStripeCheckoutSession = (sessionId) =>
  api.get('/payments/verify-checkout-session', {
    params: { session_id: sessionId },
  });


export default api;
