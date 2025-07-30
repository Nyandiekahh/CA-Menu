const fetch = require('node-fetch');

const API_BASE_URL = 'http://127.0.0.1:8000/api'; // Or from env

(async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/your-endpoint/`);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Fetch failed:", error);
  }
})();
