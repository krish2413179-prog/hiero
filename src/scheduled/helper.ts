import { 
  Transaction, 
  ScheduleCreateTransaction, 
  ScheduleSignTransaction, 
  ScheduleInfoQuery,
  TransactionId,
  AccountId,
  Client
} from "@hashgraph/sdk";
import { HieroContext } from "../core/context.js";

/**
 * ScheduledTxHelper simplifies the lifecycle of scheduled transactions.
 */
export class ScheduledTxHelper {
  private context: HieroContext;

  constructor(context: HieroContext) {
    this.context = context;
  }

  /**
   * Creates a scheduled version of any transaction.
   */
  async schedule(transaction: Transaction, memo?: string): Promise<TransactionId> {
    const client = this.context.getSDKClient();
    const scheduled = new ScheduleCreateTransaction()
      .setScheduledTransaction(transaction);
    
    if (memo) {
      scheduled.setScheduleMemo(memo);
    }

    const response = await scheduled.execute(client);
    const receipt = await response.getReceipt(client);
    
    return receipt.scheduleId!.toString() as any; // Cast as simplified ID
  }

  /**
   * Signs an existing scheduled transaction.
   */
  async sign(scheduleId: string): Promise<void> {
    const client = this.context.getSDKClient();
    const signTx = await new ScheduleSignTransaction()
      .setScheduleId(scheduleId)
      .execute(client);
    
    await signTx.getReceipt(client);
  }

  /**
   * Checks if a scheduled transaction has been executed.
   */
  async isExecuted(scheduleId: string): Promise<boolean> {
    const client = this.context.getSDKClient();
    const info = await new ScheduleInfoQuery()
      .setScheduleId(scheduleId)
      .execute(client);
    
    return info.executed !== null;
  }

  /**
   * Gets the list of signers who have already signed the scheduled transaction.
   */
  async getSigners(scheduleId: string): Promise<string[]> {
    const client = this.context.getSDKClient();
    const info = await new ScheduleInfoQuery()
      .setScheduleId(scheduleId)
      .execute(client);
    
    return (info.signers?.toArray() ?? []).map(id => id.toString());
  }
}
