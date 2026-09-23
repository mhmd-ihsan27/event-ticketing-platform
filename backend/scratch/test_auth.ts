import app from '../src/app.js';
import http from 'http';

const server = http.createServer(app);
server.listen(3001, async () => {
  console.log('🚀 Test server running on http://localhost:3001');

  try {
    // 1. Register
    const regEmail = `user_${Date.now()}@example.com`;
    console.log(`\n1️⃣ Testing POST /api/v1/auth/register with email: ${regEmail}`);
    const regRes = await fetch('http://localhost:3001/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'User Test', email: regEmail, password: 'Password123!' })
    });
    console.log('Status:', regRes.status, await regRes.json());

    // 2. Login Admin
    console.log('\n2️⃣ Testing POST /api/v1/auth/login with admin account...');
    const loginRes = await fetch('http://localhost:3001/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@eventticket.com', password: 'Admin123!' })
    });
    const loginData = await loginRes.json();
    console.log('Status:', loginRes.status, 'Login Result:', loginData);

    const accessToken = loginData.data?.tokens?.accessToken;
    const refreshToken = loginData.data?.tokens?.refreshToken;

    // 3. Profile /me
    if (accessToken) {
      console.log('\n3️⃣ Testing GET /api/v1/auth/me with Bearer token...');
      const meRes = await fetch('http://localhost:3001/api/v1/auth/me', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      console.log('Status:', meRes.status, await meRes.json());
    }

    // 4. Refresh Token
    if (refreshToken) {
      console.log('\n4️⃣ Testing POST /api/v1/auth/refresh...');
      const refRes = await fetch('http://localhost:3001/api/v1/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });
      console.log('Status:', refRes.status, await refRes.json());
    }
  } catch (err) {
    console.error('❌ Test failed:', err);
  } finally {
    server.close();
    process.exit(0);
  }
});
