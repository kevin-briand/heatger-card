import { type HomeAssistant } from 'custom-card-helpers'
import { type SeasonKey } from '../websocket/dto/zone-info.dto'

/** set the season, optionally until a date (local "YYYY-MM-DDTHH:MM"), then the next season */
export const heatgerSetSeason = async (hass: HomeAssistant, season: SeasonKey, until?: string, next?: SeasonKey): Promise<void> => {
  const data: Record<string, string> = { season }
  if (until !== undefined && until !== '') data.until = until
  if (next !== undefined) data.next = next
  await hass.callService('heatger', 'set_season', data)
}

export const heatgerToggle = async (hass: HomeAssistant, zoneNumber: number, type: 'state' | 'mode'): Promise<void> => {
  await hass.callService('heatger', 'toggle', { zone: zoneNumber, type })
}
