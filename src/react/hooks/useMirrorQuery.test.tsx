import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useMirrorQuery } from "./useMirrorQuery.js";
import { HieroProvider } from "../provider.js";
import { HieroContext } from "../../core/context.js";
import React from "react";

// Mock HieroContext and MirrorClient
const mockContext = new HieroContext({ network: "testnet" });
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <HieroProvider context={mockContext}>{children}</HieroProvider>
);

describe("useMirrorQuery", () => {
  it("should fetch data successfully", async () => {
    const mockData = { balance: 100 };
    const queryFn = vi.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() => useMirrorQuery(queryFn), { wrapper });

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it("should handle errors", async () => {
    const mockError = new Error("Fetch failed");
    const queryFn = vi.fn().mockRejectedValue(mockError);

    const { result } = renderHook(() => useMirrorQuery(queryFn), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toEqual(mockError);
  });
});
