const axios = require('axios');

async function run() {
  try {
    const loginRes = await axios.post('http://localhost:4000/api/v1/auth/login', {
      email: 'testuser1680@example.com',
      password: 'password123'
    });
    
    console.log('Login success:', loginRes.data.success);
    const token = loginRes.data.data.accessToken;
    
    const getAuctions = await axios.get('http://localhost:4000/api/v1/auctions', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Auctions:', getAuctions.data);
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
  }
}
run();
