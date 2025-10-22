const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function run() {
  try {
    // Replace with a valid post id present in your DB
    const postId = '68f807b248781e620ead9a41';

    const res = await axios.post(`${API_BASE}/comments`, {
      content: 'This is a test comment from script',
      post: postId
    }, { headers: { 'Content-Type': 'application/json' } });

    console.log('Response:', res.data);
  } catch (err) {
    console.error('Error status:', err.response?.status);
    console.error('Error data:', err.response?.data || err.message);
  }
}

run();
