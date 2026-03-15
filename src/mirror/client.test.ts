import { describe, it, expect, vi } from "vitest";
import { HieroContext } from "../core/context.js";
import { MirrorClient } from "./client.js";
import axios from "axios";

vi.mock("axios", () => {
  return {
    default: {
      create: vi.fn().mockReturnThis(),
      get: vi.fn(),
    },
  };
});

describe("MirrorClient", () => {
  const context = new HieroContext({ network: "testnet" });
  const client = new MirrorClient(context);
  const axiosInstance = (client as any).axios;

  it("should fetch account details", async () => {
    const mockData = { account: "0.0.123456" };
    vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockData });

    const account = await client.getAccount("0.0.123456");
    expect(account).toEqual(mockData);
    expect(axiosInstance.get).toHaveBeenCalledWith("/accounts/0.0.123456");
  });

  it("should fetch transactions for an account", async () => {
    const mockTxs = { transactions: [{ transaction_id: "..." }] };
    vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockTxs });

    const txs = await client.getTransactions("0.0.123456");
    expect(txs).toEqual(mockTxs.transactions);
    expect(axiosInstance.get).toHaveBeenCalledWith("/transactions", { 
      params: { "account.id": "0.0.123456", limit: 25 } 
    });
  });
});
