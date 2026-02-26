import type { GatewayRequestHandlers } from "./types.js";
import { ErrorCodes, errorShape } from "../protocol/index.js";

export const mcpHandlers: GatewayRequestHandlers = {
  "mcp.list": async ({ respond, context }) => {
    try {
      const config = await context.loadConfig();
      const mcpServers = config.mcpServers ?? {};

      const servers = Object.entries(mcpServers).map(([name, cfg]) => ({
        name,
        command: cfg.command,
        args: cfg.args ?? [],
        env: cfg.env ?? null,
      }));

      respond(true, { servers }, undefined);
    } catch (err) {
      respond(false, undefined, errorShape(ErrorCodes.UNAVAILABLE, String(err)));
    }
  },
};
