import axios, { AxiosInstance } from "axios";
import { HieroContext } from "../core/context.js";
import { MirrorPager } from "./pager.js";

export interface MirrorResponse<T> {
  [key: string]: any;
  links?: {
    next?: string;
  };
}

/**
 * MirrorClient provides typed access to the Hiero Mirror Node REST API.
 */
export class MirrorClient {
  private axios: AxiosInstance;
  private context: HieroContext;

  constructor(context: HieroContext) {
    this.context = context;
    this.axios = axios.create({
      baseURL: `${context.getMirrorNodeUrl()}/api/v1`,
    });
  }

  /**
   * Generic method to fetch data from the Mirror Node with pagination support.
   */
  async get<T>(endpoint: string, params: Record<string, any> = {}): Promise<T[]> {
    const response = await this.axios.get<MirrorResponse<T>>(endpoint, { params });
    const dataKey = Object.keys(response.data).find(key => key !== 'links');
    
    if (!dataKey) return [];
    return response.data[dataKey] as T[];
  }

  /**
   * Returns a pager for a specific endpoint to iterate through all results.
   */
  pager<T>(endpoint: string, params: Record<string, any> = {}): MirrorPager<T> {
    return new MirrorPager<T>(this.axios, endpoint, params);
  }

  /**
   * Fetches account details by ID.
   */
  async getAccount(accountId: string) {
    const response = await this.axios.get(`/accounts/${accountId}`);
    return response.data;
  }

  /**
   * Fetches transactions for an account with optional filters.
   */
  async getTransactions(accountId: string, limit: number = 25) {
    return this.get(`/transactions`, { "account.id": accountId, limit });
  }

  /**
   * Fetches token balances for an account.
   */
  async getTokenBalances(accountId: string) {
    const response = await this.axios.get(`/accounts/${accountId}/tokens`);
    return response.data.tokens;
  }

  /**
   * Fetches the total and circulating supply of HBAR.
   */
  async getNetworkSupply() {
    const response = await this.axios.get("/network/supply");
    return response.data;
  }

  /**
   * Fetches latest blocks from the network.
   */
  async getBlocks(limit: number = 25) {
    return this.get("/blocks", { limit });
  }

  /**
   * Fetches messages for a specific consensus topic.
   */
  async getTopicMessages(topicId: string, limit: number = 25) {
    return this.get(`/topics/${topicId}/messages`, { limit });
  }
}
