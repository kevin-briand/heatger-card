import { css, type CSSResultGroup, html, LitElement, type PropertyValues, type TemplateResult } from 'lit'
import { type HomeAssistant } from 'custom-card-helpers'
import { customElement, property, state } from 'lit/decorators.js'
import './components/season'
import './components/zone'
import { type SeasonInfo, type ZoneInfo } from './data/websocket/dto/zone-info.dto'
import { heatgerGetSeason, heatgerGetZonesInfo } from './data/websocket/ha-ws'

@customElement('heatger-card')
export class HeatgerCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant
  @property({ attribute: false }) public config!: Record<string, unknown>
  @state() private season: SeasonInfo | null = null
  @state() private zones: Record<string, ZoneInfo> = {}
  @state() private error: string | null = null
  private autoUpdateTimer: ReturnType<typeof setInterval> | undefined

  connectedCallback (): void {
    super.connectedCallback()
    this.autoUpdateTimer = setInterval(() => {
      void this.updateComponents()
    }, 1000)
  }

  disconnectedCallback (): void {
    super.disconnectedCallback()
    if (this.autoUpdateTimer !== undefined) clearInterval(this.autoUpdateTimer)
    this.autoUpdateTimer = undefined
  }

  protected firstUpdated (_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties)
    void this.updateComponents()
  }

  async updateComponents (): Promise<void> {
    if (this.hass === undefined) return
    try {
      const [season, zones] = await Promise.all([heatgerGetSeason(this.hass), heatgerGetZonesInfo(this.hass)])
      this.season = season
      this.zones = zones
      this.error = null
    } catch (e) {
      this.error = (e as Error).message
    }
  }

  render (): TemplateResult<1> {
    return html`
            <ha-card>
                <div class="header">
                    <div class="title">
                        <ha-icon icon="mdi:home-thermometer-outline"></ha-icon>
                        <span>${String(this.config?.title ?? 'Heatger')}</span>
                    </div>
                    <heatger-season .hass="${this.hass}" .season="${this.season}"
                      .reload="${this.updateComponents.bind(this)}"></heatger-season>
                </div>
                ${this.error !== null ? html`<p class="error">${this.error}</p>` : ''}
                <heatger-zone .hass="${this.hass}" .zones="${this.zones}" .season="${this.season}"
                  .reload="${this.updateComponents.bind(this)}"></heatger-zone>
            </ha-card>
        `
  }

  static get styles (): CSSResultGroup {
    return css`
      ha-card {
        padding: 16px;
      }

      .header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
        margin-bottom: 16px;
      }

      .title {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 1.25rem;
        line-height: 34px;
      }

      .title ha-icon {
        color: var(--state-icon-color, var(--primary-color));
      }

      .error {
        color: var(--error-color, #db4437);
        font-size: 0.85rem;
      }
    `
  }

  setConfig (config: Record<string, unknown>): void {
    this.config = config
  }

  getCardSize (): number {
    return 4
  }
}

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'heatger-card',
  name: 'Heatger Card',
  description: 'Card to manage your heatger integration',
  preview: true
})
