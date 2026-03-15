import { HieroContext, MirrorClient } from "../src/index.js";

async function main() {
  console.log("--- Hiero TS Utilities Demo ---");

  // Initialize context for Testnet
  const context = new HieroContext({ network: "testnet" });
  console.log(`Connected to: ${context.getConfig().network}`);

  // Initialize Mirror Client
  const mirror = new MirrorClient(context);

  // Fetch a well-known account (e.g., node 0.0.3)
  try {
    const accountId = "0.0.3";
    console.log(`Fetching account details for ${accountId}...`);
    const account = await mirror.getAccount(accountId);
    console.log(`Account ${accountId} balance: ${account.balance.balance} tinybars`);

    console.log(`Fetching recent transactions for ${accountId}...`);
    const txs = await mirror.getTransactions(accountId, 5);
    console.log(`Found ${txs.length} transactions.`);
  } catch (error: any) {
    console.error("Mirror Node request failed:", error.message);
  }
}

main().catch(console.error);
