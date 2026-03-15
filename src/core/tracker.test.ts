import { describe, it, expect, vi } from "vitest";
import { TransactionTracker } from "./tracker.js";
import { Client, TransactionId, TransactionReceipt, TransactionRecord } from "@hashgraph/sdk";

describe("TransactionTracker", () => {
  const mockClient = {} as Client;
  const tracker = new TransactionTracker(mockClient);

  it("should parse status codes correctly", () => {
    expect(tracker.parseStatus("INSUFFICIENT_PAYER_BALANCE")).toContain("insufficient HBAR");
    expect(tracker.parseStatus("INVALID_SIGNATURE")).toContain("signatures");
    expect(tracker.parseStatus("NOT_A_REAL_STATUS")).toContain("Unknown Hiero Error");
  });

  it("should wait for receipt (mocked)", async () => {
    const mockReceipt = { status: { toString: () => "SUCCESS" } } as TransactionReceipt;
    const mockTxId = {
      getReceipt: vi.fn().mockResolvedValue(mockReceipt)
    } as unknown as TransactionId;

    const receipt = await tracker.waitForReceipt(mockTxId);
    expect(receipt).toEqual(mockReceipt);
    expect(mockTxId.getReceipt).toHaveBeenCalledWith(mockClient);
  });
});
