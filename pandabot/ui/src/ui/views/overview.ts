import { html } from "lit";

import type { GatewayHelloOk } from "../gateway";
import { formatAgo, formatDurationMs } from "../format";
import { formatNextRun } from "../presenter";
import type { UiSettings } from "../storage";
import { t } from "../../i18n";

export type OverviewProps = {
  connected: boolean;
  hello: GatewayHelloOk | null;
  settings: UiSettings;
  password: string;
  lastError: string | null;
  presenceCount: number;
  sessionsCount: number | null;
  cronEnabled: boolean | null;
  cronNext: number | null;
  lastChannelsRefresh: number | null;
  onSettingsChange: (next: UiSettings) => void;
  onPasswordChange: (next: string) => void;
  onSessionKeyChange: (next: string) => void;
  onConnect: () => void;
  onRefresh: () => void;
};

export function renderOverview(props: OverviewProps) {
  const snapshot = props.hello?.snapshot as
    | { uptimeMs?: number; policy?: { tickIntervalMs?: number } }
    | undefined;
  const uptime = snapshot?.uptimeMs ? formatDurationMs(snapshot.uptimeMs) : "n/a";
  const tick = snapshot?.policy?.tickIntervalMs
    ? `${snapshot.policy.tickIntervalMs}ms`
    : "n/a";
  const authHint = (() => {
    if (props.connected || !props.lastError) return null;
    const lower = props.lastError.toLowerCase();
    const authFailed = lower.includes("unauthorized") || lower.includes("connect failed");
    if (!authFailed) return null;
    const hasToken = Boolean(props.settings.token.trim());
    const hasPassword = Boolean(props.password.trim());
    if (!hasToken && !hasPassword) {
      return html`
        <div class="muted" style="margin-top: 8px;">
          ${t('overview.authRequired')}
          <div style="margin-top: 6px;">
            <span class="mono">panda dashboard --no-open</span> → ${t('overview.tokenizedUrl')}<br />
            <span class="mono">panda doctor --generate-gateway-token</span> → ${t('overview.setToken')}
          </div>
          <div style="margin-top: 6px;">
            <a
              class="session-link"
              href="https://docs.panda.bot/web/dashboard"
              target="_blank"
              rel="noreferrer"
              title="${t('overview.controlUiAuthDocs')}"
              >${t('overview.controlUiAuthDocs')}</a
            >
          </div>
        </div>
      `;
    }
    return html`
      <div class="muted" style="margin-top: 8px;">
        ${t('overview.authFailed')}
        <span class="mono">panda dashboard --no-open</span>
        <div style="margin-top: 6px;">
          <a
            class="session-link"
            href="https://docs.panda.bot/web/dashboard"
            target="_blank"
            rel="noreferrer"
            title="${t('overview.controlUiAuthDocs')}"
            >${t('overview.controlUiAuthDocs')}</a
          >
        </div>
      </div>
    `;
  })();
  const insecureContextHint = (() => {
    if (props.connected || !props.lastError) return null;
    const isSecureContext = typeof window !== "undefined" ? window.isSecureContext : true;
    if (isSecureContext !== false) return null;
    const lower = props.lastError.toLowerCase();
    if (!lower.includes("secure context") && !lower.includes("device identity required")) {
      return null;
    }
    return html`
      <div class="muted" style="margin-top: 8px;">
        ${t('overview.insecureContextHint')}
        <span class="mono">http://127.0.0.1:18789</span>
        <div style="margin-top: 6px;">
          ${t('overview.insecureContextConfig')}
          <span class="mono">gateway.controlUi.allowInsecureAuth: true</span>
        </div>
        <div style="margin-top: 6px;">
          <a
            class="session-link"
            href="https://docs.panda.bot/gateway/tailscale"
            target="_blank"
            rel="noreferrer"
            title="${t('overview.tailscaleServeDocs')}"
            >${t('overview.docsTailscaleServe')}</a
          >
          <span class="muted"> · </span>
          <a
            class="session-link"
            href="https://docs.panda.bot/web/control-ui#insecure-http"
            target="_blank"
            rel="noreferrer"
            title="${t('overview.insecureHttpDocs')}"
            >${t('overview.docsInsecureHttp')}</a
          >
        </div>
      </div>
    `;
  })();

  return html`
    <section class="grid grid-cols-2">
      <div class="card">
        <div class="card-title">${t('overview.title')}</div>
        <div class="card-sub">${t('overview.subtitle')}</div>
        <div class="form-grid" style="margin-top: 16px;">
          <label class="field">
            <span>${t('overview.websocketUrl')}</span>
            <input
              .value=${props.settings.gatewayUrl}
              @input=${(e: Event) => {
                const v = (e.target as HTMLInputElement).value;
                props.onSettingsChange({ ...props.settings, gatewayUrl: v });
              }}
              placeholder="${t('overview.websocketPlaceholder')}"
            />
          </label>
          <label class="field">
            <span>${t('overview.gatewayToken')}</span>
            <input
              .value=${props.settings.token}
              @input=${(e: Event) => {
                const v = (e.target as HTMLInputElement).value;
                props.onSettingsChange({ ...props.settings, token: v });
              }}
              placeholder="${t('overview.tokenPlaceholder')}"
            />
          </label>
          <label class="field">
            <span>${t('overview.password')}</span>
            <input
              type="password"
              .value=${props.password}
              @input=${(e: Event) => {
                const v = (e.target as HTMLInputElement).value;
                props.onPasswordChange(v);
              }}
              placeholder="${t('overview.passwordPlaceholder')}"
            />
          </label>
          <label class="field">
            <span>${t('overview.defaultSession')}</span>
            <input
              .value=${props.settings.sessionKey}
              @input=${(e: Event) => {
                const v = (e.target as HTMLInputElement).value;
                props.onSessionKeyChange(v);
              }}
            />
          </label>
        </div>
        <div class="row" style="margin-top: 14px;">
          <button class="btn" @click=${() => props.onConnect()}>${t('common.connect')}</button>
          <button class="btn" @click=${() => props.onRefresh()}>${t('common.refresh')}</button>
          <span class="muted">${t('overview.clickConnectToApply')}</span>
        </div>
      </div>

      <div class="card">
        <div class="card-title">${t('overview.snapshotTitle')}</div>
        <div class="card-sub">${t('overview.snapshotSubtitle')}</div>
        <div class="stat-grid" style="margin-top: 16px;">
          <div class="stat">
            <div class="stat-label">${t('overview.statusLabel')}</div>
            <div class="stat-value ${props.connected ? "ok" : "warn"}">
              ${props.connected ? t('common.connected') : t('common.disconnected')}
            </div>
          </div>
          <div class="stat">
            <div class="stat-label">${t('overview.uptime')}</div>
            <div class="stat-value">${uptime}</div>
          </div>
          <div class="stat">
            <div class="stat-label">${t('overview.tickInterval')}</div>
            <div class="stat-value">${tick}</div>
          </div>
          <div class="stat">
            <div class="stat-label">${t('overview.lastChannelsRefresh')}</div>
            <div class="stat-value">
              ${props.lastChannelsRefresh
                ? formatAgo(props.lastChannelsRefresh)
                : t('common.na')}
            </div>
          </div>
        </div>
        ${props.lastError
          ? html`<div class="callout danger" style="margin-top: 14px;">
              <div>${props.lastError}</div>
              ${authHint ?? ""}
              ${insecureContextHint ?? ""}
            </div>`
          : html`<div class="callout" style="margin-top: 14px;">
              ${t('overview.channelsNote')}
            </div>`}
      </div>
    </section>

    <section class="grid grid-cols-3" style="margin-top: 18px;">
      <div class="card stat-card">
        <div class="stat-label">${t('overview.instancesLabel')}</div>
        <div class="stat-value">${props.presenceCount}</div>
        <div class="muted">${t('overview.instancesHelp')}</div>
      </div>
      <div class="card stat-card">
        <div class="stat-label">${t('overview.sessionsLabel')}</div>
        <div class="stat-value">${props.sessionsCount ?? t('common.na')}</div>
        <div class="muted">${t('overview.sessionsHelp')}</div>
      </div>
      <div class="card stat-card">
        <div class="stat-label">${t('overview.cronLabel')}</div>
        <div class="stat-value">
          ${props.cronEnabled == null
            ? t('common.na')
            : props.cronEnabled
              ? t('common.enabled')
              : t('common.disabled')}
        </div>
        <div class="muted">${t('overview.nextWake')} ${formatNextRun(props.cronNext)}</div>
      </div>
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="card-title">${t('overview.notesTitle')}</div>
      <div class="card-sub">${t('overview.notesSubtitle')}</div>
      <div class="note-grid" style="margin-top: 14px;">
        <div>
          <div class="note-title">Tailscale serve</div>
          <div class="muted">
            ${t('overview.tailscaleServeNote')}
          </div>
        </div>
        <div>
          <div class="note-title">${t('overview.sessionHygieneTitle')}</div>
          <div class="muted">${t('overview.sessionHygieneNote')}</div>
        </div>
        <div>
          <div class="note-title">${t('overview.cronRemindersTitle')}</div>
          <div class="muted">${t('overview.cronRemindersNote')}</div>
        </div>
      </div>
    </section>
  `;
}
