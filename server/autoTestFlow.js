const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const BASE = `http://localhost:${process.env.PORT}/api`;

async function login(email, password) {
  const res = await axios.post(`${BASE}/auth/login`, { email, password });
  return res.data?.data?.token || res.data?.token;
}

async function createProductAs(token, product) {
  const res = await axios.post(`${BASE}/products`, product, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

async function addToCartAs(token, productId, quantity = 1) {
  const res = await axios.post(`${BASE}/cart/add`, { productId, quantity }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

async function run() {
  try {
    console.log('Base URL:', BASE);

    // Login seller
    console.log('Logging in as seller...');
    const sellerToken = await login('seller@ecofinds.com', 'sellerpass123');
    console.log('Seller token length:', sellerToken ? sellerToken.length : 'none');

    // Create product as seller
    const productPayload = {
      title: 'Auto Seller Item',
      description: 'Automatically created test product for add-to-cart flow.',
      price: 9.99,
      category: 'Electronics',
      condition: 'New',
      quantity: 5
    };

    console.log('Creating product as seller...');
    const createRes = await createProductAs(sellerToken, productPayload);
    console.log('Create product response:', createRes);

    const productId = createRes.data?.product?._id || createRes.data?.product?.id;
    if (!productId) {
      console.error('Could not determine product id from create response');
      process.exit(1);
    }

    // Login testuser
    console.log('Logging in as testuser...');
    const testToken = await login('testuser@ecofinds.com', 'testpass123');
    console.log('Testuser token length:', testToken ? testToken.length : 'none');

    // Attempt to add to cart
    console.log('Adding product to testuser cart:', productId);
    const addRes = await addToCartAs(testToken, productId, 1);
    console.log('Add to cart response:', addRes);

    console.log('Auto test flow completed successfully');
    process.exit(0);
  } catch (err) {
    if (err.response) {
      console.error('HTTP error status:', err.response.status);
      console.error('Response data:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.error('Error:', err.message);
    }
    process.exit(1);
  }
}

run();
