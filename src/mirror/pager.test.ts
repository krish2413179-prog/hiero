import { describe, it, expect, vi } from "vitest";
import { MirrorPager } from "./pager.js";
import axios from "axios";

vi.mock("axios");

describe("MirrorPager", () => {
  it("should iterate through pages", async () => {
    const mockAxios: any = {
      get: vi.fn()
        .mockResolvedValueOnce({
          data: {
            items: [1, 2],
            links: { next: "/items?next=3" }
          }
        })
        .mockResolvedValueOnce({
          data: {
            items: [3],
            links: {}
          }
        })
    };

    const pager = new MirrorPager<number>(mockAxios, "/items");
    const results: number[] = [];

    for await (const item of pager.iterate()) {
      results.push(item);
    }

    expect(results).toEqual([1, 2, 3]);
    expect(mockAxios.get).toHaveBeenCalledTimes(2);
  });

  it("should return empty array if no data key found", async () => {
    const mockAxios: any = {
      get: vi.fn().mockResolvedValueOnce({
        data: { links: {} }
      })
    };

    const pager = new MirrorPager<number>(mockAxios, "/items");
    const results = await pager.all();
    expect(results).toEqual([]);
  });
});
