import { describe, test, expect, vi, beforeEach } from "vitest";
import { clearSecretStoreCacheForTests, setSecretStoreForTests } from "./store.js";

vi.mock("fs", () => ({ promises: { readFile: vi.fn(), writeFile: vi.fn(), mkdir: vi.fn() } }));
import { promises as fs } from "fs";

import {
  listUserSecrets,
  setUserSecret,
  deleteUserSecret,
  getUserSecretValue,
} from "./user-secrets.js";

const mockStore = {
  backend: "darwin-keychain" as const,
  available: true,
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
  has: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
  clearSecretStoreCacheForTests();
  setSecretStoreForTests(mockStore);
  vi.mocked(fs.mkdir).mockResolvedValue(undefined);
});

describe("listUserSecrets", () => {
  test("returns empty array when file missing", async () => {
    vi.mocked(fs.readFile).mockRejectedValue(Object.assign(new Error(), { code: "ENOENT" }));
    const result = await listUserSecrets("/tmp/test");
    expect(result).toEqual([]);
  });

  test("returns parsed list", async () => {
    const data = [{ name: "FOO", createdAt: "2026-01-01T00:00:00Z" }];
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(data) as any);
    const result = await listUserSecrets("/tmp/test");
    expect(result).toEqual(data);
  });
});

describe("setUserSecret", () => {
  test("saves to keychain and updates metadata", async () => {
    vi.mocked(fs.readFile).mockRejectedValue(Object.assign(new Error(), { code: "ENOENT" }));
    vi.mocked(fs.writeFile).mockResolvedValue(undefined);
    await setUserSecret("MY_KEY", "secret-value", "/tmp/test");
    expect(mockStore.set).toHaveBeenCalledWith(
      expect.stringContaining("MY_KEY".toLowerCase()),
      "secret-value"
    );
    expect(fs.writeFile).toHaveBeenCalled();
  });
});

describe("deleteUserSecret", () => {
  test("removes from keychain and metadata", async () => {
    const data = [{ name: "MY_KEY", createdAt: "2026-01-01T00:00:00Z" }];
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(data) as any);
    vi.mocked(fs.writeFile).mockResolvedValue(undefined);
    await deleteUserSecret("MY_KEY", "/tmp/test");
    expect(mockStore.delete).toHaveBeenCalledWith(expect.stringContaining("my_key"));
  });
});

describe("getUserSecretValue", () => {
  test("returns value from keychain", async () => {
    mockStore.get.mockReturnValue("my-secret");
    const val = getUserSecretValue("MY_KEY");
    expect(val).toBe("my-secret");
  });

  test("returns null when not found", async () => {
    mockStore.get.mockReturnValue(null);
    const val = getUserSecretValue("MISSING");
    expect(val).toBeNull();
  });
});
