// Sample brand → model catalog. Structured so it can later be swapped for a
// real catalog served from the backend (see backend/src/models/Device.js).
const brands = [
  { name: 'iPhone', models: ['iPhone 17', 'iPhone 16', 'iPhone 15', 'iPhone 14', 'iPhone 13', 'iPhone 12', 'iPhone 11', 'Older Models'] },
  { name: 'Samsung', models: ['Galaxy S24', 'Galaxy S23', 'Galaxy A54', 'Galaxy Z Fold', 'Galaxy Z Flip', 'Older Models'] },
  { name: 'Google Pixel', models: ['Pixel 9', 'Pixel 8', 'Pixel 7', 'Pixel 6', 'Older Models'] },
  { name: 'Huawei', models: ['P60', 'P50', 'Mate 50', 'Nova Series', 'Older Models'] },
  { name: 'Xiaomi', models: ['Xiaomi 14', 'Xiaomi 13', 'Redmi Note Series', 'Poco Series', 'Older Models'] },
  { name: 'OnePlus', models: ['OnePlus 12', 'OnePlus 11', 'OnePlus Nord Series', 'Older Models'] },
  { name: 'Oppo', models: ['Find X Series', 'Reno Series', 'A Series', 'Older Models'] },
  { name: 'Other Android', models: ['Sony', 'Motorola', 'Nokia', 'Other'] },
  { name: 'Tablet', models: ['iPad', 'Galaxy Tab', 'Other Tablet'] },
  { name: 'Other Devices', models: ['Smartwatch', 'Console', 'Laptop'] },
];

export default brands;
