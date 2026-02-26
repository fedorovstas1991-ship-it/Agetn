import { html, nothing } from "lit";
import type { McpServer } from "../types.ts";

export type McpProps = {
  loading: boolean;
  servers: McpServer[];
  error: string | null;
  onRefresh: () => void;
  onAddNew: () => void;
};

export function renderMcp(props: McpProps) {
  return html`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">MCP Серверы</div>
          <div class="card-sub">Управление подключениями к MCP-серверам</div>
        </div>
        <button class="btn" ?disabled=${props.loading} @click=${props.onRefresh}>
          ${props.loading ? "Загрузка…" : "Обновить"}
        </button>
      </div>

      ${
        props.error
          ? html`
              <div class="callout danger" style="margin-top: 12px;">
                ⚠️ ${props.error}
              </div>
            `
          : nothing
      }

      ${
        props.loading && props.servers.length === 0
          ? html`<div class="muted" style="margin-top: 16px;">Загрузка...</div>`
          : nothing
      }

      ${
        !props.loading && props.servers.length === 0 && !props.error
          ? html`
              <div class="muted" style="margin-top: 16px;">
                Нет настроенных MCP-серверов.
              </div>
            `
          : nothing
      }

      ${
        props.servers.length > 0
          ? html`
              <div style="margin-top: 16px;">
                <details class="agent-skills-group" open>
                  <summary class="agent-skills-header">
                    <span>Настроенные серверы</span>
                    <span class="muted">${props.servers.length}</span>
                  </summary>
                  <div class="list">
                    ${props.servers.map((server) => renderMcpServer(server))}
                  </div>
                </details>
              </div>
            `
          : nothing
      }

      <div style="margin-top: 16px;">
        <button class="btn" @click=${props.onAddNew}>
          + Подключить новый MCP-сервер
        </button>
      </div>

      <div class="callout info" style="margin-top: 16px;">
        ℹ️ MCP-серверы запускаются автоматически при первом использовании.
        Для настройки OAuth и API-ключей нажмите "Подключить новый".
      </div>
    </section>
  `;
}

function renderMcpServer(server: McpServer) {
  const commandFull = [server.command, ...server.args].join(" ");
  const envList = server.env
    ? Object.entries(server.env).map(([k, v]) => `${k}=${v}`)
    : [];

  return html`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${server.name}</div>
        <div class="muted" style="font-size: 0.85em; margin-top: 4px;">
          Команда: <code>${commandFull}</code>
        </div>
        ${
          envList.length > 0
            ? html`
                <div class="muted" style="font-size: 0.85em; margin-top: 4px;">
                  Переменные: ${envList.join(", ")}
                </div>
              `
            : html`<div class="muted" style="font-size: 0.85em; margin-top: 4px;">(нет переменных окружения)</div>`
        }
      </div>
    </div>
  `;
}
