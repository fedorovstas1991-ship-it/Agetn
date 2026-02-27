import { describe, expect, it } from "vitest";
import { buildCreateSkillChatPrompt } from "./skills-flow.ts";

describe("buildCreateSkillChatPrompt", () => {
  it("guides the agent to search community skills before proposing custom creation", () => {
    const prompt = buildCreateSkillChatPrompt();

    expect(prompt).toContain("clawhub");
    expect(prompt).toContain("community");
    expect(prompt).toContain("интернет");
    expect(prompt).toContain("создать");
  });
});
