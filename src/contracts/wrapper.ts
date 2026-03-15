import { 
  ContractExecuteTransaction, 
  ContractCallQuery, 
  ContractId, 
  Client,
  ContractFunctionParameters
} from "@hashgraph/sdk";
import { TransactionTracker } from "../core/tracker.js";

/**
 * ContractWrapper provides a simplified, type-safe-ish interface for Hiero Smart Contracts.
 */
export class ContractWrapper {
  private client: Client;
  private tracker: TransactionTracker;
  private contractId: ContractId;

  constructor(client: Client, contractId: string | ContractId) {
    this.client = client;
    this.tracker = new TransactionTracker(client);
    this.contractId = typeof contractId === "string" ? ContractId.fromString(contractId) : contractId;
  }

  /**
   * Performs a read-only call (Query) to the contract.
   */
  async callQuery(functionName: string, parameters?: ContractFunctionParameters) {
    const query = new ContractCallQuery()
      .setContractId(this.contractId)
      .setGas(100000)
      .setFunction(functionName, parameters);

    return await query.execute(this.client);
  }

  /**
   * Performs a state-changing call (Transaction) to the contract and waits for consensus.
   */
  async callTransaction(functionName: string, parameters?: ContractFunctionParameters, gas: number = 200000) {
    const transaction = new ContractExecuteTransaction()
      .setContractId(this.contractId)
      .setGas(gas)
      .setFunction(functionName, parameters);

    const response = await transaction.execute(this.client);
    return await this.tracker.waitForReceipt(response.transactionId);
  }
}
