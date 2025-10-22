const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testRegistration() {
  console.log('🧪 Testing registration endpoint...\n');

  const testUser = {
    name: 'Test User Registration',
    email: 'test-registration@example.com',
    password: 'password123'
  };

  try {
    console.log('📤 Sending registration request...');
    console.log('Data:', testUser);
    
    const response = await axios.post(`${API_BASE_URL}/auth/register`, testUser);
    
    console.log('✅ Registration successful!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.error('❌ Registration failed:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message);
    console.error('Full error:', error.response?.data);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the server is running on port 5000');
    }
  }
}

testRegistration();
