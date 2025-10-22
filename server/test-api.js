const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

const testPost = {
  title: 'Test Post from API',
  content: 'This is a test post created via API call.',
  category: '', // Will be set after getting categories
  tags: ['test', 'api'],
  status: 'published'
};

async function testAPI() {
  console.log('🧪 Starting API tests...\n');

  try {
    // Test 1: Health check
    console.log('1️⃣ Testing server health...');
    const healthResponse = await axios.get(`${API_BASE_URL.replace('/api', '')}/`);
    console.log('✅ Server is running:', healthResponse.data.message);

    // Test 2: Get categories
    console.log('\n2️⃣ Testing categories endpoint...');
    const categoriesResponse = await axios.get(`${API_BASE_URL}/categories`);
    console.log(`✅ Found ${categoriesResponse.data.data.length} categories`);
    
    if (categoriesResponse.data.data.length > 0) {
      testPost.category = categoriesResponse.data.data[0]._id;
    }

    // Test 3: Get posts
    console.log('\n3️⃣ Testing posts endpoint...');
    const postsResponse = await axios.get(`${API_BASE_URL}/posts`);
    console.log(`✅ Found ${postsResponse.data.data.length} posts`);

    // Test 4: Register user
    console.log('\n4️⃣ Testing user registration...');
    try {
      const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, testUser);
      console.log('✅ User registered successfully:', registerResponse.data.data.user.name);
      
      const token = registerResponse.data.data.token;
      
      // Test 5: Create post (authenticated)
      console.log('\n5️⃣ Testing authenticated post creation...');
      const createPostResponse = await axios.post(`${API_BASE_URL}/posts`, testPost, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Post created successfully:', createPostResponse.data.data.title);

      // Test 6: Get user profile
      console.log('\n6️⃣ Testing user profile...');
      const profileResponse = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Profile retrieved:', profileResponse.data.data.user.name);

    } catch (authError) {
      if (authError.response?.status === 400 && authError.response?.data?.message?.includes('already exists')) {
        console.log('ℹ️ User already exists, testing login instead...');
        
        // Test login
        const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
          email: testUser.email,
          password: testUser.password
        });
        console.log('✅ Login successful:', loginResponse.data.data.user.name);
      } else {
        throw authError;
      }
    }

    // Test 7: Search functionality
    console.log('\n7️⃣ Testing search functionality...');
    const searchResponse = await axios.get(`${API_BASE_URL}/posts?search=React`);
    console.log(`✅ Search found ${searchResponse.data.data.length} posts about React`);

    // Test 8: Pagination
    console.log('\n8️⃣ Testing pagination...');
    const paginationResponse = await axios.get(`${API_BASE_URL}/posts?page=1&limit=3`);
    console.log(`✅ Pagination working - page 1 with ${paginationResponse.data.data.length} posts`);
    console.log(`   Total pages: ${paginationResponse.data.pagination.pages}`);

    console.log('\n🎉 All API tests passed successfully!');
    console.log('\n📊 Database Summary:');
    console.log(`   - Categories: ${categoriesResponse.data.data.length}`);
    console.log(`   - Posts: ${postsResponse.data.data.length}`);
    console.log(`   - Search results: ${searchResponse.data.data.length}`);
    console.log(`   - Pagination: ${paginationResponse.data.pagination.total} total posts`);

  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
    if (error.response?.status === 404) {
      console.log('\n💡 Make sure the server is running on port 5000');
    }
  }
}

// Run tests
testAPI();
