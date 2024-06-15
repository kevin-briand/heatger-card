import {
  LitElement,
  html,
  type PropertyValues, type TemplateResult
} from 'lit'
import { type HomeAssistant } from 'custom-card-helpers'
import { localize } from '../../localize/localize'
import { customElement, property } from 'lit/decorators.js'
import { remainingTime } from '../../utils/convert/convert'
import { style } from '../../style'
import { type CSSResultGroup } from 'lit/development'
import { type ZoneInfo } from '../data/websocket/dto/zone-info.dto'
import { State } from '../enum/state'
import { Mode } from '../enum/mode'

@customElement('heatger-zone')
export class HeatgerZone extends LitElement {
  @property() public hass!: HomeAssistant
  @property() public zones: Record<string, ZoneInfo> = {}
  @property() public reload!: () => void
  private blinkBtnEverySeconds: boolean = true

  setZones (zones: Record<string, ZoneInfo>): void {
    this.zones = zones
  }

  protected updated (_changedProperties: PropertyValues): void {
    this.blinkBtnEverySeconds = !this.blinkBtnEverySeconds
    this.blinkStateButton()
    super.updated(_changedProperties)
  }

  createTextLine = (name: string, value: string): TemplateResult<1> => {
    return html`
            <p class="flex row">
                <span class="grow">${name}</span>
                <span>${value}</span>
            </p>
        `
  }

  createButtonLine = (name: string, value: string, onClick: CallableFunction, id: string): TemplateResult<1> => {
    return html`
            <p class="flex row">
                <span class="grow">${name}</span>
                <mwc-button @click='${() => onClick(id[id.length - 1])}' class="button btn_zone" id="${id}_${name}">
                    ${value}
                </mwc-button>
            </p>
        `
  }

  setDisableButtonsZone (disable: boolean): void {
    const buttons: NodeListOf<HTMLButtonElement> | undefined = this.shadowRoot?.querySelectorAll('.btn_zone') ?? undefined
    if (buttons === undefined) return
    buttons.forEach((btn) => {
      btn.disabled = disable
      btn.blur()
    })
  }

  toggleState = (zone: string): void => {
    this.setDisableButtonsZone(true)
    void this.hass.callService('heatger', 'toggle', {
      zone,
      type: 'state'
    })
    this.reload()
  }

  toggleMode = (zone: string): void => {
    this.setDisableButtonsZone(true)
    void this.hass.callService('heatger', 'toggle', {
      zone,
      type: 'mode'
    })
    this.reload()
  }

  blinkStateButton = (): void => {
    if (this.zones === undefined) return
    Object.keys(this.zones).forEach((key) => {
      const zone = this.zones[key]
      if (zone.isPing) {
        const button: HTMLButtonElement | undefined = this.shadowRoot?.querySelector(
                    `#${key}_${localize('card.state', this.hass.language)}`) ?? undefined
        if (button == null) return
        button.disabled = this.blinkBtnEverySeconds
      }
    })
  }

  createZone = (id: string, zone: ZoneInfo): TemplateResult<1> => {
    this.setDisableButtonsZone(false)
    return html`
            <div class="grow">
                <h2>${zone.name}</h2>
                    ${this.createButtonLine(localize('card.state', this.hass.language),
            localize(`state.${State[zone.state].toLowerCase()}`, this.hass.language), this.toggleState, id)}
                    ${this.createButtonLine(localize('card.mode', this.hass.language),
            localize(`mode.${Mode[zone.mode].toLowerCase()}`, this.hass.language), this.toggleMode, id)}
                    ${this.createTextLine(localize('card.timeout', this.hass.language), remainingTime(zone.nextSwitch, this.hass.language))}
            </div>
        `
  }

  render (): TemplateResult<1> {
    return html`
            <div class="flex gap">
                ${Object.keys(this.zones).map((zone) => this.createZone(zone, this.zones[zone]))}
            </div>
        `
  }

  static get styles (): CSSResultGroup {
    return style
  }
}
