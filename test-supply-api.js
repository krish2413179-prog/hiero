// Quick test to check the Mirror Node API response
import axios from 'axios';

async function testSupplyAPI() {
  try {
    const response = await axios.get('https://testnet.mirrornode.hedera.com/api/v1/network/supply');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testSupplyAPI();
