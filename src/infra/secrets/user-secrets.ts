import { promises as fs } from "fs";
import path from "path";
import { getSecretStore } from "./store.js";
import { buildSecretRef } from "./ref.js";

export type UserSecret = {
  name: string;
  createdAt: string;
};

const METADATA_FILE = "user-secrets.json";

function secretRef(name: string): string {
  return buildSecretRef({ namespace: "ya", provider: "user-secrets", scope: name.toLowerCase() });
}

async function readMetadata(stateDir: string): Promise<UserSecret[]> {
  const file = path.join(stateDir, METADATA_FILE);
  try {
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw) as UserSecret[];
  } catch (err: any) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

async function writeMetadata(stateDir: string, secrets: UserSecret[]): Promise<void> {
  await fs.mkdir(stateDir, { recursive: true });
  const file = path.join(stateDir, METADATA_FILE);
  await fs.writeFile(file, JSON.stringify(secrets, null, 2), "utf-8");
}

export async function listUserSecrets(stateDir: string): Promise<UserSecret[]> {
  return readMetadata(stateDir);
}

export async function setUserSecret(name: string, value: string, stateDir: string): Promise<void> {
  const store = getSecretStore();
  store.set(secretRef(name), value);
  const secrets = await readMetadata(stateDir);
  const existing = secrets.findIndex((s) => s.name === name);
  const entry: UserSecret = { name, createdAt: new Date().toISOString() };
  if (existing >= 0) {
    secrets[existing] = entry;
  } else {
    secrets.push(entry);
  }
  await writeMetadata(stateDir, secrets);
}

export async function deleteUserSecret(name: string, stateDir: string): Promise<void> {
  const store = getSecretStore();
  store.delete(secretRef(name));
  const secrets = await readMetadata(stateDir);
  await writeMetadata(stateDir, secrets.filter((s) => s.name !== name));
}

export function getUserSecretValue(name: string): string | null {
  const store = getSecretStore();
  return store.get(secretRef(name));
}
