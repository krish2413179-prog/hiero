import { describe, it, expect } from "vitest";
import { IPFSClient } from "./client.js";

describe("IPFSClient", () => {
  const client = new IPFSClient();

  it("should format metadata for HIP-412", () => {
    const metadata = {
      name: "Cool NFT",
      description: "A very cool NFT",
      image: "ipfs://hash"
    };

    const formatted = client.formatMetadata(metadata);
    const parsed = JSON.parse(formatted);

    expect(parsed.format).toBe("HIP412@1.0.0");
    expect(parsed.name).toBe("Cool NFT");
  });

  it("should resolve ipfs:// uris", () => {
    const uri = "ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco";
    const resolved = client.resolveUrl(uri);
    expect(resolved).toBe("https://ipfs.io/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco");
  });
});
