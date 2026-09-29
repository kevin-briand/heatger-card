import { css, type CSSResultGroup, html, LitElement, nothing, type TemplateResult } from 'lit'
import { type HomeAssistant } from 'custom-card-helpers'
import { customElement, property } from 'lit/decorators.js'
import { localize } from '../../localize/localize'
import { style } from '../../style'
import { heatgerSetSeason } from '../data/api/ha-api'
import { type SeasonInfo, type SeasonKey } from '../data/websocket/dto/zone-info.dto'

const SEASONS: SeasonKey[] = ['heating', 'cooling', 'stop']
const SEASON_ICONS: Record<SeasonKey, string> = {
  heating: 'mdi:fire',
  cooling: 'mdi:snowflake',
  stop: 'mdi:power'
}

/** current season (switch on click) and its programmed end; the season is programmed from the Heatger panel */
@customElement('heatger-season')
export class HeatgerSeason extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant
  @property({ attribute: false }) public season: SeasonInfo | null = null
  @property({ attribute: false }) public reload!: () => void

  private t (key: string): string {
    return localize(key, this.hass.language)
  }

  private set (season: SeasonKey): void {
    if (this.season === null || season === this.season.season) return
    void heatgerSetSeason(this.hass, season).then(() => { this.reload() })
  }

  private formatDate (value: string): string {
    return new Date(value).toLocaleString(this.hass.language, {
      weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    })
  }

  render (): TemplateResult<1> {
    const season = this.season
    if (season === null) return html``
    return html`
      <div class="season">
        <div class="segmented">
          ${SEASONS.map((key) => html`
            <button class="${key} ${key === season.season ? 'selected' : ''}" title="${this.t(`season.${key}`)}"
              @click="${() => { this.set(key) }}">
              <ha-icon icon="${SEASON_ICONS[key]}"></ha-icon>
              ${key === season.season ? this.t(`season.${key}`) : nothing}
            </button>`)}
        </div>
        ${season.until !== null
          ? html`<p class="hint until">${this.t('season.until')} ${this.formatDate(season.until)},
              ${this.t('season.then')} ${this.t(`season.${season.next}`).toLowerCase()}</p>`
          : nothing}
      </div>
    `
  }

  static get styles (): CSSResultGroup {
    return css`
      ${style}
      .season {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 4px;
      }

      .until {
        text-align: right;
      }
    `
  }
}
