import { describe, test, expect } from "vitest";
import { listGatewayMethods } from "../server-methods-list.js";

describe("Gateway methods list", () => {
  test("includes mcp.list", () => {
    const methods = listGatewayMethods();
    expect(methods).toContain("mcp.list");
  });
});
