import { HieroContext, MirrorClient } from './dist/index.js';

async function test() {
  const context = new HieroContext({ network: 'testnet' });
  const mirror = new MirrorClient(context);
  try {
    const supply = await mirror.getNetworkSupply();
    console.log('Library Supply Output:', JSON.stringify(supply, null, 2));
  } catch (err) {
    console.error('Library Supply Error:', err);
  }
}

test();
