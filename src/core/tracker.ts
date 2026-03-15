import { Client, Transaction, TransactionId, TransactionReceipt, TransactionRecord } from "@hashgraph/sdk";

/**
 * TransactionTracker provides reliable tracking of transaction consensus.
 */
export class TransactionTracker {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  /**
   * Waits for a transaction to reach consensus and returns the receipt.
   */
  async waitForReceipt(transactionId: TransactionId | string): Promise<TransactionReceipt> {
    const id = typeof transactionId === "string" ? TransactionId.fromString(transactionId) : transactionId;
    // Note: In real SDK, we usually get receipt from the response object, 
    // but this helper allows tracking by ID alone.
    return await id.getReceipt(this.client);
  }

  /**
   * Waits for consensus and returns the full record.
   */
  async waitForRecord(transactionId: TransactionId | string): Promise<TransactionRecord> {
    const id = typeof transactionId === "string" ? TransactionId.fromString(transactionId) : transactionId;
    return await id.getRecord(this.client);
  }

  /**
   * Maps Hiero status codes to human-readable error messages.
   */
  parseStatus(status: string): string {
    const statusMap: Record<string, string> = {
      "INSUFFICIENT_PAYER_BALANCE": "Account has insufficient HBAR to pay for the transaction.",
      "INVALID_SIGNATURE": "One or more signatures provided are invalid.",
      "TRANSACTION_EXPIRED": "The transaction reached the network too late.",
      "ACCOUNT_ID_DOES_NOT_EXIST": "The specified account ID was not found on the network.",
    };

    return statusMap[status] || `Unknown Hiero Error: ${status}`;
  }
}
