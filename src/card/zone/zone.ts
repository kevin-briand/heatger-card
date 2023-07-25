import {
  LitElement,
  html,
  type PropertyValues, type TemplateResult
} from 'lit'
import { type HomeAssistant } from 'custom-card-helpers'
import { type ZoneDto } from './dto/zoneDto'
import { localize } from '../../localize/localize'
import { customElement, property } from 'lit/decorators.js'
import { remainingTime } from '../../utils/convert/convert'
import { style } from '../../style'
import { type CSSResultGroup } from 'lit/development'

@customElement('heatger-zone')
export class HeatgerZone extends LitElement {
  @property() public hass!: HomeAssistant
  @property() public zones: ZoneDto[] = []
  private blinkBtnEverySeconds: boolean = true

  setZones (zones: ZoneDto[]): void {
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
                <mwc-button @click='${() => onClick(id)}' class="button btn_zone" id="${id}_${name}">
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
    void this.hass.callService('mqtt', 'publish', {
      topic: `homeassistant/button/${zone}_switch_state/commands`
    })
  }

  toggleMode = (zone: string): void => {
    this.setDisableButtonsZone(true)
    void this.hass.callService('mqtt', 'publish', {
      topic: `homeassistant/button/${zone}_switch_mode/commands`
    })
  }

  blinkStateButton = (): void => {
    if (this.zones === undefined) return
    this.zones.forEach((zone) => {
      if (zone.isPing) {
        const button: HTMLButtonElement | undefined = this.shadowRoot?.querySelector(
                    `#${zone.id}_${localize('panel.prog.state', this.hass.language)}`) ?? undefined
        if (button == null) return
        button.disabled = this.blinkBtnEverySeconds
      }
    })
  }

  createZone = (zone: ZoneDto): TemplateResult<1> => {
    this.setDisableButtonsZone(false)
    return html`
            <div class="grow">
                <h2>${zone.name}</h2>
                    ${this.createButtonLine(localize('panel.prog.state', this.hass.language),
            localize(`state.${zone.state.toLowerCase()}`, this.hass.language), this.toggleState, zone.id)}
                    ${this.createButtonLine(localize('card.mode', this.hass.language),
            localize(`mode.${zone.mode.toLowerCase()}`, this.hass.language), this.toggleMode, zone.id)}
                    ${this.createTextLine(localize('card.timeout', this.hass.language), remainingTime(zone.nextChange))}
            </div>
        `
  }

  render (): TemplateResult<1> {
    return html`
            <div class="flex gap">
                ${this.zones.map((zone) => this.createZone(zone))}
            </div>
        `
  }

  static get styles (): CSSResultGroup {
    return style
  }
}
