import { render } from "lit";
import { describe, expect, it, vi } from "vitest";
import type { SessionsListResult } from "../types.ts";
import { renderChat, type ChatProps } from "./chat.ts";

function createSessions(): SessionsListResult {
  return {
    ts: 0,
    path: "",
    count: 0,
    defaults: { model: null, contextTokens: null },
    sessions: [],
  };
}

function createProps(overrides: Partial<ChatProps> = {}): ChatProps {
  return {
    sessionKey: "main",
    onSessionKeyChange: () => undefined,
    thinkingLevel: null,
    showThinking: false,
    loading: false,
    sending: false,
    canAbort: false,
    compactionStatus: null,
    messages: [],
    toolMessages: [],
    stream: null,
    streamStartedAt: null,
    assistantAvatarUrl: null,
    draft: "",
    queue: [],
    connected: true,
    canSend: true,
    disabledReason: null,
    error: null,
    basePath: "",
    connectionGraceActive: false,
    showOnboardingHeroLoader: false,
    sessions: createSessions(),
    focusMode: false,
    assistantName: "OpenClaw",
    assistantAvatar: null,
    onRefresh: () => undefined,
    onToggleFocusMode: () => undefined,
    onDraftChange: () => undefined,
    onSend: () => undefined,
    onQueueRemove: () => undefined,
    onNewSession: () => undefined,
    showFirstGreetingCta: false,
    onOpenTelegramSetup: () => undefined,
    onInsertAutomationPrompt: () => undefined,
    onDismissFirstGreetingCta: () => undefined,
    ...overrides,
  };
}

describe("chat view", () => {
  it("renders compacting indicator as a badge", () => {
    const container = document.createElement("div");
    render(
      renderChat(
        createProps({
          compactionStatus: {
            active: true,
            startedAt: Date.now(),
            completedAt: null,
          },
        }),
      ),
      container,
    );

    const indicator = container.querySelector(".compaction-indicator--active");
    expect(indicator).not.toBeNull();
    expect(indicator?.textContent).toContain("Сжимаю контекст...");
  });

  it("renders completion indicator shortly after compaction", () => {
    const container = document.createElement("div");
    const nowSpy = vi.spyOn(Date, "now").mockReturnValue(1_000);
    render(
      renderChat(
        createProps({
          compactionStatus: {
            active: false,
            startedAt: 900,
            completedAt: 900,
          },
        }),
      ),
      container,
    );

    const indicator = container.querySelector(".compaction-indicator--complete");
    expect(indicator).not.toBeNull();
    expect(indicator?.textContent).toContain("Контекст сжат");
    nowSpy.mockRestore();
  });

  it("hides stale compaction completion indicator", () => {
    const container = document.createElement("div");
    const nowSpy = vi.spyOn(Date, "now").mockReturnValue(10_000);
    render(
      renderChat(
        createProps({
          compactionStatus: {
            active: false,
            startedAt: 0,
            completedAt: 0,
          },
        }),
      ),
      container,
    );

    expect(container.querySelector(".compaction-indicator")).toBeNull();
    nowSpy.mockRestore();
  });

  it("shows a stop button when aborting is available", () => {
    const container = document.createElement("div");
    const onAbort = vi.fn();
    render(
      renderChat(
        createProps({
          canAbort: true,
          onAbort,
        }),
      ),
      container,
    );

    const stopButton = Array.from(container.querySelectorAll("button")).find(
      (btn) => btn.textContent?.trim() === "Стоп",
    );
    expect(stopButton).not.toBeUndefined();
    stopButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(onAbort).toHaveBeenCalledTimes(1);
  });

  it("shows a new session button when aborting is unavailable", () => {
    const container = document.createElement("div");
    const onNewSession = vi.fn();
    render(
      renderChat(
        createProps({
          canAbort: false,
          onNewSession,
        }),
      ),
      container,
    );

    const newSessionButton = Array.from(container.querySelectorAll("button")).find(
      (btn) => btn.textContent?.trim() === "Новый чат",
    );
    expect(newSessionButton).not.toBeUndefined();
    newSessionButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(onNewSession).toHaveBeenCalledTimes(1);
  });

  it("renders onboarding CTA under first greeting", () => {
    const container = document.createElement("div");
    render(
      renderChat(
        createProps({
          showFirstGreetingCta: true,
        }),
      ),
      container,
    );

    expect(container.textContent).toContain("Подключи Telegram");
    expect(container.textContent).toContain("Подключить");
  });

  it("prioritizes NDA Telegram CTA when both CTA flags are enabled", () => {
    const container = document.createElement("div");
    render(
      renderChat(
        createProps({
          showFirstGreetingCta: true,
          showNdaTelegramCta: true,
        }),
      ),
      container,
    );

    expect(container.textContent).toContain("Подключить NDA-бота");
    expect(container.textContent).not.toContain("Сформулировать в чате");
  });

  it("renders chat card as static to prevent hover jitter", () => {
    const container = document.createElement("div");
    render(renderChat(createProps()), container);

    const chatCard = container.querySelector("section.chat");
    expect(chatCard).not.toBeNull();
    expect(chatCard?.classList.contains("chat--static")).toBe(true);
  });

  it("shows mini tamagotchi loader during reconnect grace and hides error callout", () => {
    const container = document.createElement("div");
    render(
      renderChat(
        createProps({
          connected: false,
          connectionGraceActive: true,
          error: "disconnected (1006): no reason",
        }),
      ),
      container,
    );

    expect(container.querySelector(".chat-tamagotchi-loader--mini")).not.toBeNull();
    expect(container.querySelector(".callout.danger")).toBeNull();
  });

  it("shows hero tamagotchi loader while waiting for first onboarding response", () => {
    const container = document.createElement("div");
    render(
      renderChat(
        createProps({
          showOnboardingHeroLoader: true,
          sending: true,
          messages: [{ role: "user", content: [{ type: "text", text: "Привет" }] }],
          stream: "",
        }),
      ),
      container,
    );

    expect(container.querySelector(".chat-tamagotchi-loader--hero")).not.toBeNull();
  });

  it("shows hero tamagotchi loader even when prior assistant messages exist", () => {
    const container = document.createElement("div");
    render(
      renderChat(
        createProps({
          showOnboardingHeroLoader: true,
          messages: [
            {
              role: "assistant",
              content: [{ type: "text", text: "Старое сообщение" }],
            },
            { role: "user", content: [{ type: "text", text: "Привет" }] },
          ],
          stream: "",
          sending: true,
        }),
      ),
      container,
    );

    expect(container.querySelector(".chat-tamagotchi-loader--hero")).not.toBeNull();
  });

  it("keeps hero loader and suppresses callouts while onboarding response is pending", () => {
    const container = document.createElement("div");
    render(
      renderChat(
        createProps({
          connected: false,
          connectionGraceActive: false,
          showOnboardingHeroLoader: true,
          sending: false,
          loading: false,
          stream: "",
          disabledReason: "Подключись к gateway, чтобы начать чат...",
          error: "disconnected (1006): no reason",
        }),
      ),
      container,
    );

    expect(container.querySelector(".chat-tamagotchi-loader--hero")).not.toBeNull();
    expect(container.querySelector(".callout")).toBeNull();
    expect(container.querySelector(".callout.danger")).toBeNull();
  });
});
