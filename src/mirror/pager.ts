import axios, { AxiosInstance } from "axios";
import { MirrorResponse } from "./client.js";

/**
 * MirrorPager provides an async iterator to handle pagination automatically.
 * Enables developers to use: for await (const item of pager.iterate("/accounts")) { ... }
 */
export class MirrorPager<T> {
  private axios: AxiosInstance;
  private endpoint: string;
  private params: Record<string, any>;

  constructor(axiosInstance: AxiosInstance, endpoint: string, params: Record<string, any> = {}) {
    this.axios = axiosInstance;
    this.endpoint = endpoint;
    this.params = params;
  }

  /**
   * Returns an async generator that yields items one by one.
   */
  async *iterate(): AsyncGenerator<T> {
    let nextUrl: string | undefined = this.endpoint;
    let currentParams = { ...this.params };

    while (nextUrl) {
      const response: any = await this.axios.get<MirrorResponse<T>>(nextUrl, {
        params: currentParams,
      });

      const dataKey = Object.keys(response.data).find((key) => key !== "links");
      if (!dataKey) break;

      const items = response.data[dataKey] as T[];
      for (const item of items) {
        yield item;
      }

      // Mirror node sometimes returns a full URL in links.next, or just the query string
      nextUrl = response.data.links?.next;
      
      // If we have a next URL from links, we clear params because they are encoded in the URL
      if (nextUrl) {
        currentParams = {};
      }
    }
  }

  /**
   * Fetches all items into a single array. Use with caution for large datasets.
   */
  async all(): Promise<T[]> {
    const results: T[] = [];
    for await (const item of this.iterate()) {
      results.push(item);
    }
    return results;
  }
}
