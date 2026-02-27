import type { GatewayRequestHandlers } from "./types.js";
import { ErrorCodes, errorShape } from "../protocol/index.js";
import {
  listUserSecrets,
  setUserSecret,
  deleteUserSecret,
  getUserSecretValue,
} from "../../infra/secrets/user-secrets.js";
import { STATE_DIR } from "../../config/paths.js";

const NAME_REGEX = /^[A-Z0-9_]+$/;

export const secretsHandlers: GatewayRequestHandlers = {
  "secrets.list": async ({ respond }) => {
    try {
      const secrets = await listUserSecrets(STATE_DIR);
      respond(true, { secrets }, undefined);
    } catch (err) {
      respond(false, undefined, errorShape(ErrorCodes.UNAVAILABLE, String(err)));
    }
  },

  "secrets.set": async ({ params, respond }) => {
    const { name, value } = params as { name: string; value: string };
    if (!name || !NAME_REGEX.test(name)) {
      respond(
        false,
        undefined,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          "Secret name must be uppercase letters, digits and underscores only (e.g. GOOGLE_API_KEY)",
        ),
      );
      return;
    }
    if (!value || typeof value !== "string") {
      respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "Secret value is required"));
      return;
    }
    try {
      await setUserSecret(name, value, STATE_DIR);
      respond(true, { ok: true }, undefined);
    } catch (err) {
      respond(false, undefined, errorShape(ErrorCodes.UNAVAILABLE, String(err)));
    }
  },

  "secrets.delete": async ({ params, respond }) => {
    const { name } = params as { name: string };
    if (!name || !NAME_REGEX.test(name)) {
      respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "Secret name must be uppercase letters, digits and underscores only"));
      return;
    }
    try {
      await deleteUserSecret(name, STATE_DIR);
      respond(true, { ok: true }, undefined);
    } catch (err) {
      respond(false, undefined, errorShape(ErrorCodes.UNAVAILABLE, String(err)));
    }
  },

  "secrets.get": async ({ params, respond }) => {
    const { name } = params as { name: string };
    if (!name || !NAME_REGEX.test(name)) {
      respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "Secret name must be uppercase letters, digits and underscores only"));
      return;
    }
    try {
      // getUserSecretValue is synchronous
      const value = getUserSecretValue(name);
      if (value === null) {
        respond(
          false,
          undefined,
          errorShape(ErrorCodes.NOT_FOUND, `Secret not found: ${name}`),
        );
        return;
      }
      respond(true, { value }, undefined);
    } catch (err) {
      respond(false, undefined, errorShape(ErrorCodes.UNAVAILABLE, String(err)));
    }
  },
};
