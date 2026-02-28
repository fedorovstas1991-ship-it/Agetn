import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { makeTempWorkspace, writeWorkspaceFile } from "../test-helpers/workspace.js";
import {
  DEFAULT_MEMORY_ALT_FILENAME,
  DEFAULT_MEMORY_FILENAME,
  ensureAgentWorkspace,
  loadWorkspaceBootstrapFiles,
  resolveDefaultAgentWorkspaceDir,
} from "./workspace.js";

describe("resolveDefaultAgentWorkspaceDir", () => {
  it("uses OPENCLAW_HOME for default workspace resolution", () => {
    const dir = resolveDefaultAgentWorkspaceDir({
      OPENCLAW_HOME: "/srv/openclaw-home",
      HOME: "/home/other",
    } as NodeJS.ProcessEnv);

    expect(dir).toBe(path.join(path.resolve("/srv/openclaw-home"), ".openclaw", "workspace"));
  });
});

describe("loadWorkspaceBootstrapFiles", () => {
  it("includes MEMORY.md when present", async () => {
    const tempDir = await makeTempWorkspace("openclaw-workspace-");
    await writeWorkspaceFile({ dir: tempDir, name: "MEMORY.md", content: "memory" });

    const files = await loadWorkspaceBootstrapFiles(tempDir);
    const memoryEntries = files.filter((file) =>
      [DEFAULT_MEMORY_FILENAME, DEFAULT_MEMORY_ALT_FILENAME].includes(file.name),
    );

    expect(memoryEntries).toHaveLength(1);
    expect(memoryEntries[0]?.missing).toBe(false);
    expect(memoryEntries[0]?.content).toBe("memory");
  });

  it("includes memory.md when MEMORY.md is absent", async () => {
    const tempDir = await makeTempWorkspace("openclaw-workspace-");
    await writeWorkspaceFile({ dir: tempDir, name: "memory.md", content: "alt" });

    const files = await loadWorkspaceBootstrapFiles(tempDir);
    const memoryEntries = files.filter((file) =>
      [DEFAULT_MEMORY_FILENAME, DEFAULT_MEMORY_ALT_FILENAME].includes(file.name),
    );

    expect(memoryEntries).toHaveLength(1);
    expect(memoryEntries[0]?.missing).toBe(false);
    expect(memoryEntries[0]?.content).toBe("alt");
  });

  it("omits memory entries when no memory files exist", async () => {
    const tempDir = await makeTempWorkspace("openclaw-workspace-");

    const files = await loadWorkspaceBootstrapFiles(tempDir);
    const memoryEntries = files.filter((file) =>
      [DEFAULT_MEMORY_FILENAME, DEFAULT_MEMORY_ALT_FILENAME].includes(file.name),
    );

    expect(memoryEntries).toHaveLength(0);
  });
});

describe("ensureAgentWorkspace", () => {
  it("seeds bootstrap and tools guidance for skills, memory, search, and community skill discovery", async () => {
    const tempDir = await makeTempWorkspace("openclaw-workspace-seed-");

    await ensureAgentWorkspace({ dir: tempDir, ensureBootstrapFiles: true });

    const bootstrap = await fs.readFile(path.join(tempDir, "BOOTSTRAP.md"), "utf-8");
    const tools = await fs.readFile(path.join(tempDir, "TOOLS.md"), "utf-8");

    expect(bootstrap).toContain("skills");
    expect(bootstrap).toContain("memory-core");
    expect(bootstrap).toContain("one-search");
    expect(bootstrap).toContain("TOOLS.md");
    expect(bootstrap).toContain("Sonnet 4.5");
    expect(bootstrap).toContain("Codex 5.3");
    expect(bootstrap).toContain("clawhub");

    expect(tools).toContain("one-search");
    expect(tools).toContain("DuckDuckGo");
    expect(tools).toContain("memory_search");
    expect(tools).toContain("qmd");
    expect(tools).toContain("ollama");
    expect(tools).toContain("/think");
    expect(tools).toContain("/verbose");
    expect(tools).toContain("/reasoning");
    expect(tools).toContain("npx -y clawhub");
    expect(tools).toContain("community");
  });
});
