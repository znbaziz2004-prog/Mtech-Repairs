import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_BASE_URL = API_URL.replace(/\/$/, '');
export const BACKEND_URL = API_BASE_URL.replace(/\/api$/, '');

export const getImageUrl = (image) => {
  if (!image) return '';
  if (image.startsWith('http')) return image;

  return `${BACKEND_URL}${image.startsWith('/') ? '' : '/'}${image}`;
};

const api = axios.create({
  baseURL: API_BASE_URL,
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

export const createBankTransferOrder = (formData) =>
  api.post('/payments/bank-transfer', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export default api;