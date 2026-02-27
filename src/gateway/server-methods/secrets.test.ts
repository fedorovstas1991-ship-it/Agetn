import { describe, test, expect, vi, beforeEach } from "vitest";

vi.mock("../../infra/secrets/user-secrets.js", () => ({
  listUserSecrets: vi.fn(),
  setUserSecret: vi.fn(),
  deleteUserSecret: vi.fn(),
  getUserSecretValue: vi.fn(),
}));

vi.mock("../../config/paths.js", () => ({
  STATE_DIR: "/tmp/test-state",
}));

import {
  listUserSecrets,
  setUserSecret,
  deleteUserSecret,
  getUserSecretValue,
} from "../../infra/secrets/user-secrets.js";
import { secretsHandlers } from "./secrets.js";

const mockList = vi.mocked(listUserSecrets);
const mockSet = vi.mocked(setUserSecret);
const mockDelete = vi.mocked(deleteUserSecret);
const mockGet = vi.mocked(getUserSecretValue);

function makeRespond() {
  let success: boolean = false;
  let data: any;
  let error: any;
  const respond = vi.fn((s: boolean, d: any, e?: any) => {
    success = s;
    data = d;
    error = e;
  });
  return { respond, get: () => ({ success, data, error }) };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("secrets.list", () => {
  test("returns secrets list", async () => {
    mockList.mockResolvedValue([{ name: "FOO", createdAt: "2026-01-01T00:00:00Z" }]);
    const { respond, get } = makeRespond();
    await secretsHandlers["secrets.list"]({ params: {}, respond, context: {} } as any);
    expect(get().success).toBe(true);
    expect(get().data.secrets).toHaveLength(1);
    expect(get().data.secrets[0].name).toBe("FOO");
  });
});

describe("secrets.set", () => {
  test("saves secret and returns ok", async () => {
    mockSet.mockResolvedValue(undefined);
    const { respond, get } = makeRespond();
    await secretsHandlers["secrets.set"]({
      params: { name: "FOO", value: "bar" },
      respond,
      context: {},
    } as any);
    expect(get().success).toBe(true);
    expect(get().data.ok).toBe(true);
    expect(mockSet).toHaveBeenCalledWith("FOO", "bar", "/tmp/test-state");
  });

  test("returns error on invalid name", async () => {
    const { respond, get } = makeRespond();
    await secretsHandlers["secrets.set"]({
      params: { name: "invalid name!", value: "x" },
      respond,
      context: {},
    } as any);
    expect(get().success).toBe(false);
  });

  test("returns error when value missing", async () => {
    const { respond, get } = makeRespond();
    await secretsHandlers["secrets.set"]({
      params: { name: "FOO", value: "" },
      respond,
      context: {},
    } as any);
    expect(get().success).toBe(false);
  });
});

describe("secrets.delete", () => {
  test("deletes secret and returns ok", async () => {
    mockDelete.mockResolvedValue(undefined);
    const { respond, get } = makeRespond();
    await secretsHandlers["secrets.delete"]({
      params: { name: "FOO" },
      respond,
      context: {},
    } as any);
    expect(get().success).toBe(true);
    expect(get().data.ok).toBe(true);
  });

  test("returns error on invalid name", async () => {
    const { respond, get } = makeRespond();
    await secretsHandlers["secrets.delete"]({ params: { name: "" }, respond, context: {} } as any);
    expect(get().success).toBe(false);
  });
});

describe("secrets.get", () => {
  test("returns value when found", async () => {
    mockGet.mockReturnValue("secret-value");
    const { respond, get } = makeRespond();
    await secretsHandlers["secrets.get"]({
      params: { name: "FOO" },
      respond,
      context: {},
    } as any);
    expect(get().success).toBe(true);
    expect(get().data.value).toBe("secret-value");
  });

  test("returns error when not found", async () => {
    mockGet.mockReturnValue(null);
    const { respond, get } = makeRespond();
    await secretsHandlers["secrets.get"]({
      params: { name: "MISSING" },
      respond,
      context: {},
    } as any);
    expect(get().success).toBe(false);
  });

  test("returns error on invalid name", async () => {
    const { respond, get } = makeRespond();
    await secretsHandlers["secrets.get"]({ params: { name: "invalid!" }, respond, context: {} } as any);
    expect(get().success).toBe(false);
  });
});
