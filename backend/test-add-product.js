const axios = require('axios');
async function run() {
  try {
    const loginRes = await axios.post('http://localhost:4000/api/v1/auth/login', {
      email: 'testuser1680@example.com',
      password: 'password123'
    });
    const token = loginRes.data.data.accessToken;
    
    const prodRes = await axios.post('http://localhost:4000/api/v1/products', {
      name: 'Test Product',
      startingPrice: 100
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Success:', prodRes.data);
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
  }
}
run();
