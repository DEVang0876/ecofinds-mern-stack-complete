const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

async function run() {
  try {
    const api = axios.create({ baseURL: `http://localhost:${process.env.PORT}/api` });

    // Login as testuser
    const loginRes = await api.post('/auth/login', {
      email: 'testuser@ecofinds.com',
      password: 'testpass123'
    });

    const token = loginRes.data?.data?.token;
    if (!token) {
      console.error('No token returned from login');
      process.exit(1);
    }

    console.log('Logged in, token length:', token.length);

    // Get products
    const productsRes = await api.get('/products');
    const products = productsRes.data?.data?.products || productsRes.data?.data || [];
    const productId = products[0]._id || products[0].id;
    console.log('Attempting to add product to cart:', productId);

    // Add to cart with Authorization header
    const addRes = await api.post('/cart/add', { productId, quantity: 1 }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Add to cart response:', addRes.data);
    process.exit(0);
  } catch (err) {
    if (err.response) {
      console.error('Error response:', err.response.status, err.response.data);
    } else {
      console.error('Error:', err.message);
    }
    process.exit(1);
  }
}

run();
