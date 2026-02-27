import { html, nothing } from "lit";
import type { UserSecret } from "../types.js";

export type SecretsProps = {
  loading: boolean;
  secrets: UserSecret[];
  error: string | null;
  addFormOpen: boolean;
  addFormName: string;
  addFormValue: string;
  addFormShowValue: boolean;
  addFormError: string | null;
  addFormSaving: boolean;
  revealedSecrets: Record<string, string | null>;
  onRefresh: () => void;
  onAddOpen: () => void;
  onAddCancel: () => void;
  onAddNameChange: (v: string) => void;
  onAddValueChange: (v: string) => void;
  onAddToggleShow: () => void;
  onAddSave: () => void;
  onDelete: (name: string) => void;
  onReveal: (name: string) => void;
  onHide: (name: string) => void;
};

export function renderSecrets(props: SecretsProps) {
  return html`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Секреты</div>
          <div class="card-sub">API-ключи и токены для агента</div>
        </div>
        <div class="row" style="gap: 8px;">
          <button class="btn" ?disabled=${props.loading} @click=${props.onRefresh}>
            ${props.loading ? "Загрузка…" : "Обновить"}
          </button>
          <button class="btn" @click=${props.onAddOpen}>+ Добавить</button>
        </div>
      </div>

      ${props.error
        ? html`<div class="callout danger" style="margin-top: 12px;">⚠️ ${props.error}</div>`
        : nothing}

      ${props.addFormOpen ? renderAddForm(props) : nothing}

      ${!props.loading && props.secrets.length === 0 && !props.error
        ? html`<div class="muted" style="margin-top: 16px;">Нет сохранённых секретов.</div>`
        : nothing}

      ${props.secrets.length > 0
        ? html`
            <div style="margin-top: 16px;">
              <div class="list">
                ${props.secrets.map((s) => renderSecretRow(s, props))}
              </div>
            </div>
          `
        : nothing}

      <div class="callout info" style="margin-top: 16px;">
        ℹ️ Значения хранятся в системном хранилище ключей (macOS Keychain). Агент обращается к ним по имени.
      </div>
    </section>
  `;
}

function renderAddForm(props: SecretsProps) {
  return html`
    <div class="card" style="margin-top: 16px; background: var(--surface-2, #f5f5f5);">
      <div class="card-title" style="font-size: 1em;">Новый секрет</div>

      ${props.addFormError
        ? html`<div class="callout danger" style="margin: 8px 0;">${props.addFormError}</div>`
        : nothing}

      <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 10px;">
        <div>
          <label class="label">Имя (например, GOOGLE_API_KEY)</label>
          <input
            class="input"
            type="text"
            placeholder="MY_API_KEY"
            .value=${props.addFormName}
            @input=${(e: Event) => props.onAddNameChange((e.target as HTMLInputElement).value.toUpperCase().replace(/[^A-Z0-9_]/g, ""))}
            style="font-family: monospace;"
          />
        </div>
        <div>
          <label class="label">Значение</label>
          <div class="row" style="gap: 8px;">
            <input
              class="input"
              type=${props.addFormShowValue ? "text" : "password"}
              placeholder="Вставьте ключ или токен"
              .value=${props.addFormValue}
              @input=${(e: Event) => props.onAddValueChange((e.target as HTMLInputElement).value)}
              style="flex: 1;"
            />
            <button class="btn" @click=${props.onAddToggleShow}>
              ${props.addFormShowValue ? "Скрыть" : "Показать"}
            </button>
          </div>
        </div>
        <div class="row" style="gap: 8px; justify-content: flex-end;">
          <button class="btn" @click=${props.onAddCancel} ?disabled=${props.addFormSaving}>Отмена</button>
          <button class="btn" @click=${props.onAddSave} ?disabled=${props.addFormSaving || !props.addFormName || !props.addFormValue}>
            ${props.addFormSaving ? "Сохранение…" : "Сохранить"}
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderSecretRow(secret: UserSecret, props: SecretsProps) {
  const revealed = props.revealedSecrets[secret.name];
  const date = new Date(secret.createdAt).toLocaleDateString("ru-RU");
  // Show full value when revealed, masked otherwise
  const displayValue = revealed ?? "••••••••";

  return html`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title" style="font-family: monospace;">${secret.name}</div>
        <div class="muted" style="font-size: 0.85em; margin-top: 2px;">
          <span style="font-family: monospace;">${displayValue}</span>
          &nbsp;·&nbsp; Создан ${date}
        </div>
      </div>
      <div class="row" style="gap: 6px;">
        <button class="btn btn-sm" @click=${() => revealed ? props.onHide(secret.name) : props.onReveal(secret.name)}>
          ${revealed ? "Скрыть" : "Показать"}
        </button>
        <button class="btn btn-sm" @click=${() => props.onDelete(secret.name)}>
          Удалить
        </button>
      </div>
    </div>
  `;
}
