import { describe, test, expect, vi } from "vitest";
import { listGatewayMethods } from "../server-methods-list.js";
import { coreGatewayHandlers } from "../server-methods.js";

vi.mock("../../config/config.js", () => ({
  loadConfig: vi.fn(),
}));

import { loadConfig } from "../../config/config.js";
import { mcpHandlers } from "./mcp.js";

const mockLoadConfig = vi.mocked(loadConfig);

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
    mockLoadConfig.mockReturnValue({
      mcpServers: {
        "test-server": {
          command: "npx",
          args: ["-y", "test-mcp"],
          env: { TEST: "value" },
        },
      },
    } as any);

    let respondCalled = false;
    let respondSuccess = false;
    let respondData: any = null;

    await mcpHandlers["mcp.list"]({
      params: {},
      respond: (success, data) => {
        respondCalled = true;
        respondSuccess = success;
        respondData = data;
      },
      context: {} as any,
    } as any);

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
    mockLoadConfig.mockReturnValue({} as any);

    let respondData: any = null;

    await mcpHandlers["mcp.list"]({
      params: {},
      respond: (_success, data) => {
        respondData = data;
      },
      context: {} as any,
    } as any);

    expect(respondData.servers).toEqual([]);
  });

  test("handles config load error", async () => {
    mockLoadConfig.mockImplementation(() => {
      throw new Error("Config unavailable");
    });

    let respondSuccess = false;
    let respondError: any = null;

    await mcpHandlers["mcp.list"]({
      params: {},
      respond: (success, _data, error) => {
        respondSuccess = success;
        respondError = error;
      },
      context: {} as any,
    } as any);

    expect(respondSuccess).toBe(false);
    expect(respondError).toBeTruthy();
  });
});
