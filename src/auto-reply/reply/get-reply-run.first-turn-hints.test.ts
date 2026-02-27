import { describe, expect, it } from "vitest";
import { buildFirstTurnSystemHint } from "./get-reply-run.js";

describe("buildFirstTurnSystemHint", () => {
  it("returns telegram commands hint for first direct telegram turn", () => {
    const hint = buildFirstTurnSystemHint({
      isFirstTurnInSession: true,
      isBareSessionReset: false,
      sessionCtx: {
        OriginatingChannel: "telegram",
        ChatType: "direct",
      } as never,
    });

    expect(hint).toContain("/think");
    expect(hint).toContain("/verbose");
    expect(hint).toContain("/reasoning");
  });

  it("skips hint for non-telegram channels", () => {
    const hint = buildFirstTurnSystemHint({
      isFirstTurnInSession: true,
      isBareSessionReset: false,
      sessionCtx: {
        OriginatingChannel: "whatsapp",
        ChatType: "direct",
      } as never,
    });

    expect(hint).toBe("");
  });

  it("skips hint for group chats and bare resets", () => {
    expect(
      buildFirstTurnSystemHint({
        isFirstTurnInSession: true,
        isBareSessionReset: false,
        sessionCtx: {
          OriginatingChannel: "telegram",
          ChatType: "group",
        } as never,
      }),
    ).toBe("");

    expect(
      buildFirstTurnSystemHint({
        isFirstTurnInSession: true,
        isBareSessionReset: true,
        sessionCtx: {
          OriginatingChannel: "telegram",
          ChatType: "direct",
        } as never,
      }),
    ).toBe("");
  });
});
