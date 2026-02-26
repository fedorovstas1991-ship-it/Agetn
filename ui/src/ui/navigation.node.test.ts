import { describe, test, expect } from "vitest";
import { tabFromPath, pathForTab, iconForTab, titleForTab, TAB_GROUPS } from "./navigation.js";

describe("navigation MCP tab", () => {
  test("mcp is in Tab type", () => {
    const path = pathForTab("mcp");
    expect(path).toBe("/mcp");
  });

  test("tabFromPath recognizes /mcp", () => {
    const tab = tabFromPath("/mcp", "");
    expect(tab).toBe("mcp");
  });

  test("mcp is in Capabilities group", () => {
    const capabilitiesGroup = TAB_GROUPS.find((g) => g.label === "Возможности");
    expect(capabilitiesGroup?.tabs).toContain("mcp");
  });

  test("mcp has icon", () => {
    const icon = iconForTab("mcp");
    expect(icon).toBeTruthy();
  });

  test("mcp has title", () => {
    const title = titleForTab("mcp");
    expect(title).toBe("MCP");
  });
});
