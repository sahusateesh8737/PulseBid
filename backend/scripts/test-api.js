const http = require('http');

const API_URL = 'http://localhost:4000/api/v1';

async function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${API_URL}${path}`);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch(e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING BACKEND API TESTS ---');

  // 1. Health Check
  const health = await request('GET', '/health');
  console.log('[GET /health]', health.status === 200 ? '✅' : '❌', health.data);

  // 2. Signup / Create Org
  const rand = Math.floor(Math.random() * 10000);
  const email = `testuser${rand}@example.com`;
  console.log(`\nCreating org with email: ${email}`);
  const signup = await request('POST', '/auth/signup/create-org', {
    name: 'Test Admin',
    email: email,
    password: 'password123',
    orgName: `Test Org ${rand}`,
    industry: 'Software'
  });
  console.log('[POST /auth/signup/create-org]', signup.status === 201 ? '✅' : '❌', signup.status);
  
  if (signup.status !== 201) {
    console.error('Signup failed, aborting further tests:', signup.data);
    return;
  }

  // 3. Login
  const login = await request('POST', '/auth/login', {
    email: email,
    password: 'password123'
  });
  console.log('[POST /auth/login]', login.status === 200 ? '✅' : '❌', login.status);
  
  const token = login.data?.data?.accessToken;
  if (!token) {
    console.error('Login failed to return token, aborting.');
    return;
  }

  // 4. Create Product (Inventory)
  const product = await request('POST', '/products', {
    name: 'Vintage Rolex',
    description: '1970 Submariner',
    startingPrice: 15000
  }, token);
  console.log('[POST /products]', product.status === 201 ? '✅' : '❌', product.status, product.status !== 201 ? product.data : '');
  
  const productId = product.data?.data?.id;

  // 5. Create Auction
  let auctionId = null;
  if (productId) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const auction = await request('POST', '/auctions', {
      productId: productId,
      startTime: new Date().toISOString(),
      endTime: tomorrow.toISOString(),
      startingPrice: 15000
    }, token);
    console.log('[POST /auctions]', auction.status === 201 ? '✅' : '❌', auction.status, auction.status !== 201 ? auction.data : '');
    
    auctionId = auction.data?.data?.id;
  }

  // 6. List Auctions
  const auctionsList = await request('GET', '/auctions', null, token);
  console.log('[GET /auctions]', auctionsList.status === 200 ? '✅' : '❌', `Returned ${auctionsList.data?.data?.length || 0} auctions`);

  // 7. Place Bid
  if (auctionId) {
    console.log('Waiting 12 seconds for the worker to start the auction...');
    await new Promise(res => setTimeout(res, 12000));
    
    const bid1 = await request('POST', `/auctions/${auctionId}/bids`, {
      amount: 15100
    }, token);
    console.log('[POST /bids/:id] (Valid Bid)', bid1.status === 200 ? '✅' : '❌', bid1.status);

    const bid2 = await request('POST', `/auctions/${auctionId}/bids`, {
      amount: 15000 // Invalid bid (lower than current)
    }, token);
    console.log('[POST /bids/:id] (Invalid Low Bid)', bid2.status === 409 ? '✅' : '❌', 'Expected 409, got', bid2.status);
    
    // 8. Get Bids for Auction
    const bidsList = await request('GET', `/auctions/${auctionId}/bids`, null, token);
    console.log('[GET /auctions/:id/bids]', bidsList.status === 200 ? '✅' : '❌', `Returned ${bidsList.data?.data?.length || 0} bids`);
  }

  console.log('\n--- API TESTS COMPLETED ---');
}

runTests().catch(console.error);
