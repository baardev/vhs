// Simple script to directly test the backend API
const axios = require('axios');
require('dotenv').config();

async function testApi() {
  try {
    console.log('Testing API endpoint...');

    // Check for API key
    const apiKey = process.env.NEWS_API_KEY;
    console.log('API Key exists:', !!apiKey);
    if (apiKey) {
      console.log('API Key length:', apiKey.length);
    }

    // Direct request to the news API
    console.log('\nTesting direct call to News API...');
    try {
      const newsApiUrl = `https://newsapi.org/v2/everything?q=golf&sortBy=publishedAt&apiKey=${apiKey}`;
      const directResponse = await axios.get(newsApiUrl);
      console.log('Direct API call status:', directResponse.status);
      console.log('Direct API articles count:', directResponse.data.articles?.length || 0);
      console.log('First article title:', directResponse.data.articles?.[0]?.title || 'No article');
    } catch (error) {
      console.error('Direct API call failed:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
    }

    // Test local backend API
    console.log('\nTesting local backend API...');
    try {
      const backendResponse = await axios.get('/api/golf-news');
      console.log('Backend API call status:', backendResponse.status);
      console.log('Backend API articles count:', backendResponse.data?.length || 0);
      console.log('First article title:', backendResponse.data?.[0]?.title || 'No article');
    } catch (error) {
      console.error('Backend API call failed:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
    }

    console.log('\nTest completed');
  } catch (error) {
    console.error('General error:', error);
  }
}

testApi();