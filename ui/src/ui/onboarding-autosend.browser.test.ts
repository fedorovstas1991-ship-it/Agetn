import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { OpenClawApp } from "./app.ts";

// oxlint-disable-next-line typescript/unbound-method
const originalConnect = OpenClawApp.prototype.connect;

function mountApp(pathname: string) {
  window.history.replaceState({}, "", pathname);
  const app = document.createElement("openclaw-app") as OpenClawApp;
  document.body.append(app);
  return app;
}

beforeEach(() => {
  vi.useFakeTimers();
  OpenClawApp.prototype.connect = () => {
    // no-op: avoid real gateway WS connections in browser tests
  };
  window.__OPENCLAW_CONTROL_UI_BASE_PATH__ = undefined;
  localStorage.clear();
  document.body.innerHTML = "";
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
  OpenClawApp.prototype.connect = originalConnect;
  window.__OPENCLAW_CONTROL_UI_BASE_PATH__ = undefined;
  localStorage.clear();
  document.body.innerHTML = "";
});

describe("onboarding auto-send", () => {
  it("retries welcome auto-send after reconnect", async () => {
    const app = mountApp("/chat?onboarding=1");
    await app.updateComplete;

    app.connected = false;
    const sendSpy = vi.fn(async () => {
      if (app.connected) {
        app.chatMessage = "";
      }
    });
    (app as unknown as { handleSendChat: () => Promise<void> }).handleSendChat = sendSpy;

    (app as unknown as { _handleOnboardingComplete: () => void })._handleOnboardingComplete();
    await vi.advanceTimersByTimeAsync(5_000);

    expect(sendSpy).not.toHaveBeenCalled();
    expect(app.chatMessage).toBe("Привет! Что ты умеешь?");

    app.connected = true;
    await vi.advanceTimersByTimeAsync(2_000);

    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(app.chatMessage).toBe("");
  });

  it("retries if the first send attempt does not clear the draft", async () => {
    const app = mountApp("/chat?onboarding=1");
    await app.updateComplete;

    app.connected = true;
    let attempts = 0;
    const sendSpy = vi.fn(async () => {
      attempts += 1;
      if (attempts >= 2) {
        app.chatMessage = "";
      }
    });
    (app as unknown as { handleSendChat: () => Promise<void> }).handleSendChat = sendSpy;

    (app as unknown as { _handleOnboardingComplete: () => void })._handleOnboardingComplete();
    await vi.advanceTimersByTimeAsync(5_000);

    expect(sendSpy).toHaveBeenCalledTimes(2);
    expect(app.chatMessage).toBe("");
  });
});
