import { html, LitElement, type PropertyValues, type TemplateResult } from 'lit'
import { type HomeAssistant } from 'custom-card-helpers'
import { customElement, property } from 'lit/decorators.js'
import './components/frostfree'
import './components/zone'
import { type HassConfig } from 'home-assistant-js-websocket/dist/types'
import { type HeatgerZone } from './components/zone'
import { type HeatgerFrostfree } from './components/frostfree'
import type { ZoneInfo } from './data/websocket/dto/zone-info.dto'
import { heatgerGetFrostfreeInfo, heatgerGetZonesInfo } from './data/websocket/ha-ws'

@customElement('heatger-card')
export class HeatgerCard extends LitElement {
  @property() public hass!: HomeAssistant
  @property() public config!: HassConfig
  private frostFreeActivated = false
  private readonly AutoUpdateTimer: NodeJS.Timeout | undefined

  constructor () {
    super()
    this.AutoUpdateTimer = setInterval(() => {
      void this.updateComponents().catch(e => { console.error(e) })
    }, 1000)
  }

  protected firstUpdated (_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties)
    void this.updateComponents()
  }

  getComponents (): TemplateResult<1> {
    let zone = html``
    if (!this.frostFreeActivated) {
      zone = html`
                <heatger-zone .reload="${this.updateComponents.bind(this)}" .hass="${this.hass}"></heatger-zone>
            `
    }
    return html`
            ${zone}
            <heatger-frostfree .reload="${this.updateComponents.bind(this)}" .hass="${this.hass}"></heatger-frostfree>
        `
  }

  async updateComponents (): Promise<void> {
    const frostFreeEndDate = await heatgerGetFrostfreeInfo(this.hass)
    this.frostFreeActivated = frostFreeEndDate > 0
    const heatgerFrostfree: HeatgerFrostfree | undefined = this.shadowRoot?.querySelector('heatger-frostfree') as HeatgerFrostfree
    if (heatgerFrostfree === undefined) return
    heatgerFrostfree.setEndDate(frostFreeEndDate)
    heatgerFrostfree.requestUpdate()
    this.requestUpdate()

    const zonesDatas: Record<string, ZoneInfo> = await heatgerGetZonesInfo(this.hass)
    const heatgerZone: HeatgerZone | undefined = this.shadowRoot?.querySelector('heatger-zone') as HeatgerZone ?? undefined
    if (heatgerZone !== undefined) {
      heatgerZone.setZones(zonesDatas)
      heatgerZone.requestUpdate()
    }
  }

  render (): TemplateResult<1> {
    return html`
            <ha-card header="Heatger" >
                <div class="card-content">
                    ${this.getComponents()}
                </div>
            </ha-card>
        `
  }

  setConfig (config: HassConfig): void {
    this.config = config
  }
}

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'heatger-card',
  name: 'Heatger Card',
  description: 'Card to manage your heatger integration',
  preview: true
})
