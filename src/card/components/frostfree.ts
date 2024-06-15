import {
  LitElement,
  html,
  css, type CSSResultGroup
} from 'lit'
import { type HomeAssistant } from 'custom-card-helpers'
import { localize } from '../../localize/localize'
import { customElement, property } from 'lit/decorators.js'
import { remainingTime } from '../../utils/convert/convert'
import { style } from '../../style'
import { type TemplateResult } from 'lit/development'
import { heatgerActivateFrostfree, heatgerDeactivateFrostfree } from '../data/api/ha-api'

@customElement('heatger-frostfree')
export class HeatgerFrostfree extends LitElement {
  @property() public hass!: HomeAssistant
  @property() public endDate: number | undefined
  @property() public reload!: () => void

  async handleFrostFree (ev: MouseEvent): Promise<void> {
    ev.preventDefault()
    const dateInput: HTMLInputElement | undefined = this.shadowRoot?.querySelector('#endDate') ?? undefined
    if ((dateInput !== undefined) && dateInput.value === '') return
    if (dateInput === undefined) {
      await heatgerDeactivateFrostfree(this.hass)
    } else {
      await heatgerActivateFrostfree(this.hass, new Date(dateInput.value))
    }
    this.reload()
  }

  setEndDate (endDate: number | undefined): void {
    this.endDate = endDate
  }

  render (): TemplateResult<1> {
    if (this.endDate !== undefined && this.endDate > 0) {
      return html`
                <div>
                    <h2>${localize('card.frostFree.title', this.hass.language)}</h2>
                    <div class="flex flex-center">
                        <div class="row">
                            <span class="center">${remainingTime(this.endDate.valueOf(), this.hass.language)}</span>
                        </div>
                    </div>
                    <div class="flex flex-center">
                        <div class="row">
                            <mwc-button @click='${this.handleFrostFree}' class="button" id="stop">
                                ${localize('card.frostFree.stop', this.hass.language)}
                            </mwc-button>
                        </div>
                    </div>
                </div>
            `
    }

    return html`
            <div class="grow">
                <h2>${localize('card.frostFree.frostFree', this.hass.language)}</h2>
                <form>
                    <div class="flex row"">
                        <label for="endDate">${localize('card.frostFree.endDate', this.hass.language)}</label>
                        <input class="grow" type="datetime-local" id="endDate">
                        <mwc-button @click='${this.handleFrostFree}' class="button">
                            ${localize('card.frostFree.activate', this.hass.language)}
                        </mwc-button>
                    </div>
                </form>
            </div>
        `
  }

  static get styles (): CSSResultGroup {
    return css`
          ${style}
          input[type="datetime-local"] {
            height: 40px;
            background-color: var(--card-background-color);
            border: 0;
          }
        `
  }
}
