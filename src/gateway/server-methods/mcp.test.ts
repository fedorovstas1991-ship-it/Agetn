import { describe, test, expect } from "vitest";
import { listGatewayMethods } from "../server-methods-list.js";
import { coreGatewayHandlers } from "../server-methods.js";
import { mcpHandlers } from "./mcp.js";
import type { GatewayContext } from "./types.js";

describe("Gateway methods list", () => {
  test("includes mcp.list", () => {
    const methods = listGatewayMethods();
    expect(methods).toContain("mcp.list");
  });
});

describe("Gateway core handlers", () => {
  test("registers mcp.list handler", () => {
    expect(coreGatewayHandlers["mcp.list"]).toBeTypeOf("function");
  });
});

describe("mcp.list handler", () => {
  test("returns servers from config", async () => {
    let respondCalled = false;
    let respondSuccess = false;
    let respondData: any = null;

    const mockContext: Partial<GatewayContext> = {
      loadConfig: async () => ({
        mcpServers: {
          "test-server": {
            command: "npx",
            args: ["-y", "test-mcp"],
            env: { TEST: "value" },
          },
        },
      }),
    };

    await mcpHandlers["mcp.list"]({
      params: {},
      respond: (success, data, error) => {
        respondCalled = true;
        respondSuccess = success;
        respondData = data;
      },
      context: mockContext as GatewayContext,
    });

    expect(respondCalled).toBe(true);
    expect(respondSuccess).toBe(true);
    expect(respondData.servers).toHaveLength(1);
    expect(respondData.servers[0]).toEqual({
      name: "test-server",
      command: "npx",
      args: ["-y", "test-mcp"],
      env: { TEST: "value" },
    });
  });

  test("returns empty array when no mcpServers", async () => {
    let respondData: any = null;

    const mockContext: Partial<GatewayContext> = {
      loadConfig: async () => ({}),
    };

    await mcpHandlers["mcp.list"]({
      params: {},
      respond: (success, data) => {
        respondData = data;
      },
      context: mockContext as GatewayContext,
    });

    expect(respondData.servers).toEqual([]);
  });

  test("handles config load error", async () => {
    let respondSuccess = false;
    let respondError: any = null;

    const mockContext: Partial<GatewayContext> = {
      loadConfig: async () => {
        throw new Error("Config unavailable");
      },
    };

    await mcpHandlers["mcp.list"]({
      params: {},
      respond: (success, data, error) => {
        respondSuccess = success;
        respondError = error;
      },
      context: mockContext as GatewayContext,
    });

    expect(respondSuccess).toBe(false);
    expect(respondError).toBeTruthy();
  });
});
