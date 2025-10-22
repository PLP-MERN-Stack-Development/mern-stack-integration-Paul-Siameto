const axios = require('axios');

const API = 'http://localhost:5000/api';

async function run() {
  try {
    // create a test user
    const random = Date.now();
    const user = { name: 'TestUser'+random, email: `test${random}@example.com`, password: 'password123' };

    console.log('Registering user...');
    let token;
    try {
      const reg = await axios.post(`${API}/auth/register`, user);
      token = reg.data.data.token;
      console.log('Registered OK', reg.data.data.user.email);
    } catch (err) {
      if (err.response && err.response.status === 400 && err.response.data.message && err.response.data.message.includes('already exists')) {
        console.log('User exists, logging in...');
        const login = await axios.post(`${API}/auth/login`, { email: user.email, password: user.password });
        token = login.data.data.token;
      } else if (err.response) {
        console.error('Registration error', err.response.data);
        return;
      } else {
        console.error('Reg error', err.message);
        return;
      }
    }

    // get a post to comment on
    const postsRes = await axios.get(`${API}/posts?limit=1&status=published`);
    const posts = postsRes.data.data;
    if (!posts || posts.length === 0) {
      console.error('No posts available to comment on');
      return;
    }
    const postId = posts[0]._id;
    console.log('Using post', postId);

    // attempt to create a comment
    try {
      const res = await axios.post(`${API}/comments`, { content: 'Test comment from script', post: postId }, { headers: { Authorization: `Bearer ${token}` } });
      console.log('Comment created:', res.data.data._id);
    } catch (err) {
      console.error('Comment create failed:', err.response ? err.response.data : err.message);
    }

  } catch (error) {
    console.error('Unexpected error in test script', error);
  }
}

run();
