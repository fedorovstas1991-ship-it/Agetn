import type { GatewayBrowserClient } from "../gateway.js";
import type { UserSecret, SecretsListResult } from "../types.js";

export type SecretsState = {
  client: GatewayBrowserClient | null;
  secretsLoading: boolean;
  secrets: UserSecret[];
  secretsError: string | null;
};

export async function loadSecrets(state: SecretsState): Promise<void> {
  if (!state.client) {
    state.secretsError = "Gateway client not available";
    return;
  }
  state.secretsLoading = true;
  state.secretsError = null;
  try {
    const result = await state.client.request("secrets.list", {});
    state.secrets = (result as SecretsListResult).secrets;
  } catch (err) {
    state.secretsError = String(err);
    state.secrets = [];
  } finally {
    state.secretsLoading = false;
  }
}

export async function saveSecret(
  client: GatewayBrowserClient,
  name: string,
  value: string,
): Promise<void> {
  await client.request("secrets.set", { name, value });
}

export async function deleteSecret(
  client: GatewayBrowserClient,
  name: string,
): Promise<void> {
  await client.request("secrets.delete", { name });
}

export async function revealSecret(
  client: GatewayBrowserClient,
  name: string,
): Promise<string> {
  const result = await client.request("secrets.get", { name }) as { value: string };
  return result.value;
}
