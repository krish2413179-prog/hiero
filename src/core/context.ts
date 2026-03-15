import { Client, AccountId, PrivateKey } from "@hashgraph/sdk";

export type NetworkType = "mainnet" | "testnet" | "previewnet";

export interface HieroConfig {
  network: NetworkType;
  operatorId?: string;
  operatorKey?: string;
  mirrorNodeUrl?: string;
}

/**
 * HieroContext manages the network configuration and SDK client instance.
 * Inspired by the enterprise-java HieroContext pattern.
 */
export class HieroContext {
  private client: Client;
  private config: HieroConfig;

  constructor(config: HieroConfig) {
    this.config = config;
    
    switch (config.network) {
      case "mainnet":
        this.client = Client.forMainnet();
        break;
      case "testnet":
        this.client = Client.forTestnet();
        break;
      case "previewnet":
        this.client = Client.forPreviewnet();
        break;
      default:
        throw new Error(`Unsupported network: ${config.network}`);
    }

    if (config.operatorId && config.operatorKey) {
      this.client.setOperator(
        AccountId.fromString(config.operatorId),
        PrivateKey.fromString(config.operatorKey)
      );
    }
  }

  /**
   * Returns the underlying Hashgraph SDK Client.
   */
  getSDKClient(): Client {
    return this.client;
  }

  /**
   * Returns the current configuration.
   */
  getConfig(): HieroConfig {
    return this.config;
  }

  /**
   * Returns the default Mirror Node URL for the configured network.
   */
  getMirrorNodeUrl(): string {
    if (this.config.mirrorNodeUrl) return this.config.mirrorNodeUrl;
    
    switch (this.config.network) {
      case "mainnet":
        return "https://mainnet-public.mirrornode.hedera.com";
      case "testnet":
        return "https://testnet.mirrornode.hedera.com";
      case "previewnet":
        return "https://previewnet.mirrornode.hedera.com";
    }
  }
}
