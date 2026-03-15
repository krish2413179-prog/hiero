import axios from "axios";

export interface HIP412Metadata {
  name: string;
  description: string;
  image: string;
  type?: string;
  attributes?: Array<{ trait_type: string; value: any }>;
  properties?: Record<string, any>;
}

/**
 * IPFSClient provides helpers for HIP-412 metadata management and IPFS uploading.
 */
export class IPFSClient {
  private gateway: string;

  constructor(gateway: string = "https://ipfs.io/ipfs/") {
    this.gateway = gateway;
  }

  /**
   * Formats a metadata object according to HIP-412 standards.
   */
  formatMetadata(metadata: HIP412Metadata): string {
    return JSON.stringify({
      ...metadata,
      format: "HIP412@1.0.0"
    });
  }

  /**
   * Resolves an IPFS URI to a gateway URL.
   */
  resolveUrl(uri: string): string {
    if (uri.startsWith("ipfs://")) {
      return this.gateway + uri.replace("ipfs://", "");
    }
    return uri;
  }

  /**
   * Simple helper to fetch JSON from IPFS.
   */
  async fetchMetadata(uri: string): Promise<HIP412Metadata> {
    const url = this.resolveUrl(uri);
    const response = await axios.get(url);
    return response.data;
  }
}
