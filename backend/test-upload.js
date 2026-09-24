const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function run() {
  try {
    const loginRes = await axios.post('http://localhost:4000/api/v1/auth/login', {
      email: 'testuser1680@example.com',
      password: 'password123'
    });
    const token = loginRes.data.data.accessToken;
    
    const form = new FormData();
    form.append('image', fs.createReadStream('dummy.jpg'));
    
    const uploadRes = await axios.post('http://localhost:4000/api/v1/upload/image', form, {
      headers: { 
        ...form.getHeaders(),
        Authorization: `Bearer ${token}` 
      }
    });
    console.log('Success:', uploadRes.data);
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
  }
}
run();
