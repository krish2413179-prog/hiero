import axios from 'axios';

async function checkSupply() {
  try {
    const response = await axios.get('https://testnet.mirrornode.hedera.com/api/v1/network/supply');
    console.log('Testnet Supply:', JSON.stringify(response.data, null, 2));
  } catch (err) {
    console.error('Error fetching supply:', err.message);
  }
}

checkSupply();
