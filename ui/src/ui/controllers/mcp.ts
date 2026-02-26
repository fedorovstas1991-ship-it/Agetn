import type { GatewayBrowserClient } from "../gateway.js";
import type { McpListResult } from "../types.js";

export type McpState = {
  client: GatewayBrowserClient | null;
  mcpLoading: boolean;
  mcpServers: McpListResult["servers"];
  mcpError: string | null;
};

export async function loadMcpServers(state: McpState): Promise<void> {
  if (!state.client) {
    state.mcpError = "Gateway client not available";
    return;
  }

  state.mcpLoading = true;
  state.mcpError = null;

  try {
    const result = await state.client.request("mcp.list", {});
    state.mcpServers = (result as McpListResult).servers;
  } catch (err) {
    state.mcpError = String(err);
    state.mcpServers = [];
  } finally {
    state.mcpLoading = false;
  }
}
