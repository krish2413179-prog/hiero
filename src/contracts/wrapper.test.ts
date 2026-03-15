import { describe, it, expect, vi } from "vitest";
import { ContractWrapper } from "./wrapper.js";
import { Client, ContractId, ContractCallQuery, ContractExecuteTransaction } from "@hashgraph/sdk";

describe("ContractWrapper", () => {
  const mockClient = {} as Client;
  const contractId = "0.0.1234";
  const wrapper = new ContractWrapper(mockClient, contractId);

  it("should initialize with string or ContractId", () => {
    const w2 = new ContractWrapper(mockClient, ContractId.fromString(contractId));
    expect((w2 as any).contractId.toString()).toBe(contractId);
  });

  // Future: Add more complex mocks for query/transaction execution if needed
  // For now, verifying initialization and basic method availability
  it("should have core methods", () => {
    expect(wrapper.callQuery).toBeDefined();
    expect(wrapper.callTransaction).toBeDefined();
  });
});
