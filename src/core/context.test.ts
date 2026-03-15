import { describe, it, expect, vi } from "vitest";
import { HieroContext } from "./context.js";
import { Client } from "@hashgraph/sdk";

describe("HieroContext", () => {
  it("should initialize for testnet", () => {
    const context = new HieroContext({ network: "testnet" });
    expect(context.getConfig().network).toBe("testnet");
    expect(context.getMirrorNodeUrl()).toContain("testnet");
    expect(context.getSDKClient()).toBeInstanceOf(Client);
  });

  it("should initialize for mainnet", () => {
    const context = new HieroContext({ network: "mainnet" });
    expect(context.getConfig().network).toBe("mainnet");
    expect(context.getMirrorNodeUrl()).toContain("mainnet");
  });

  it("should throw for unsupported networks", () => {
    expect(() => new HieroContext({ network: "invalid" as any })).toThrow("Unsupported network");
  });

  it("should return custom mirror node url", () => {
    const customUrl = "https://my-mirror.com";
    const context = new HieroContext({ network: "testnet", mirrorNodeUrl: customUrl });
    expect(context.getMirrorNodeUrl()).toBe(customUrl);
  });
});
