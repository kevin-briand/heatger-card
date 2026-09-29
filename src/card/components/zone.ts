import { css, html, LitElement, nothing, type CSSResultGroup, type TemplateResult } from 'lit'
import { type HomeAssistant } from 'custom-card-helpers'
import { customElement, property, state } from 'lit/decorators.js'
import { localize } from '../../localize/localize'
import { remainingTime } from '../../utils/convert/convert'
import { style } from '../../style'
import { type SeasonInfo, type ZoneInfo } from '../data/websocket/dto/zone-info.dto'
import { heatgerToggle } from '../data/api/ha-api'
import { State } from '../enum/state'
import { Mode } from '../enum/mode'

const STATES: Record<number, { key: string, icon: string, css: string }> = {
  [State.COMFORT]: { key: 'comfort', icon: 'mdi:sun-thermometer', css: 'comfort' },
  [State.ECO]: { key: 'eco', icon: 'mdi:leaf', css: 'eco' },
  [State.FROST_FREE]: { key: 'frostFree', icon: 'mdi:snowflake-thermometer', css: 'off' }
}

/** one tile per zone: state (click = toggle until the next change), mode (click = auto / manual), next change */
@customElement('heatger-zone')
export class HeatgerZone extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant
  @property({ attribute: false }) public zones: Record<string, ZoneInfo> = {}
  @property({ attribute: false }) public season: SeasonInfo | null = null
  @property({ attribute: false }) public reload!: () => void
  @state() private busy: string | null = null

  setZones (zones: Record<string, ZoneInfo>): void {
    this.zones = zones
  }

  private t (key: string): string {
    return localize(key, this.hass.language)
  }

  private get stopped (): boolean {
    return this.season?.season === 'stop'
  }

  toggle (zone: ZoneInfo, type: 'state' | 'mode'): void {
    if (this.busy !== null || this.stopped) return
    this.busy = zone.id
    heatgerToggle(this.hass, zone.number, type)
      .then(() => { this.busy = null; this.reload() })
      .catch(() => { this.busy = null })
  }

  private renderZone (zone: ZoneInfo): TemplateResult<1> {
    const info = this.stopped
      ? { key: '', icon: 'mdi:power', css: 'off' }
      : STATES[zone.state] ?? STATES[State.ECO]
    const label = this.stopped ? this.t('season.stop') : this.t(`state.${info.key}`)
    const manual = zone.mode === Mode.MANUAL
    const disabled = this.stopped || this.busy === zone.id
    return html`
      <div class="tile ${info.css}">
        <div class="head">
          <span class="name">${zone.name}</span>
          <button class="mode ${manual ? 'manual' : ''}" ?disabled="${disabled}"
            title="${this.t('card.toggleMode')}" @click="${() => { this.toggle(zone, 'mode') }}">
            <ha-icon icon="${manual ? 'mdi:hand-back-right-outline' : 'mdi:calendar-clock'}"></ha-icon>
            ${this.t(`mode.${manual ? 'manual' : 'auto'}`)}
          </button>
        </div>
        <button class="state ${zone.isPing && !this.stopped ? 'waiting' : ''}" ?disabled="${disabled}"
          title="${this.t('card.toggleState')}" @click="${() => { this.toggle(zone, 'state') }}">
          <ha-icon icon="${info.icon}"></ha-icon>
          <span>${label}</span>
        </button>
        <div class="foot">
          ${this.stopped
            ? html`<span class="hint">${this.t('season.stopHint')}</span>`
            : zone.isPing
              ? html`<ha-icon icon="mdi:home-account"></ha-icon><span class="hint">${this.t('card.waitingPresence')}</span>`
              : manual
                ? html`<ha-icon icon="mdi:timer-off-outline"></ha-icon><span class="hint">${this.t('card.noProgram')}</span>`
                : html`<ha-icon icon="mdi:timer-outline"></ha-icon>
                  <span class="hint">${this.t('card.nextChange')} ${remainingTime(zone.nextSwitch, this.hass.language)}</span>`}
        </div>
      </div>
    `
  }

  render (): TemplateResult<1> {
    const zones = Object.values(this.zones).sort((a, b) => a.number - b.number)
    if (zones.length === 0) return html`<p class="hint">${this.t('card.noZone')}</p>`
    return html`<div class="grid">${zones.map((zone) => this.renderZone(zone))}</div>${nothing}`
  }

  static get styles (): CSSResultGroup {
    return css`
      ${style}
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 12px;
      }

      .tile {
        --tile-color: var(--hg-eco);
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 12px;
        border-radius: var(--hg-radius);
        border: 1px solid var(--hg-border);
        background-color: color-mix(in srgb, var(--tile-color) 6%, transparent);
      }

      .tile.comfort {
        --tile-color: var(--hg-comfort);
      }

      .tile.off {
        --tile-color: var(--hg-off);
      }

      .head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }

      .name {
        font-weight: 500;
        font-size: 1rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .mode {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        height: 24px;
        padding: 0 8px;
        border-radius: 12px;
        border: 1px solid var(--hg-border);
        background: transparent;
        color: var(--hg-muted);
        font-size: 0.75rem;
        cursor: pointer;
        white-space: nowrap;
        --mdc-icon-size: 14px;
      }

      .mode.manual {
        border-color: var(--warning-color, #ffa600);
        color: var(--warning-color, #ffa600);
      }

      .state {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        padding: 10px 12px;
        border: none;
        border-radius: 10px;
        background-color: color-mix(in srgb, var(--tile-color) 20%, transparent);
        color: var(--primary-text-color);
        font-size: 1.05rem;
        font-weight: 500;
        cursor: pointer;
        --mdc-icon-size: 24px;
      }

      .state ha-icon {
        color: var(--tile-color);
      }

      .state:hover:not([disabled]), .mode:hover:not([disabled]) {
        filter: brightness(1.1);
      }

      .state[disabled], .mode[disabled] {
        cursor: default;
      }

      .state.waiting {
        animation: pulse 1.6s ease-in-out infinite;
      }

      @keyframes pulse {
        50% {
          background-color: color-mix(in srgb, var(--hg-comfort) 30%, transparent);
        }
      }

      .foot {
        display: flex;
        align-items: center;
        gap: 6px;
        color: var(--hg-muted);
        min-height: 18px;
        --mdc-icon-size: 16px;
      }
    `
  }
}
