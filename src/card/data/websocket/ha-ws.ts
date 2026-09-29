import { type HomeAssistant } from 'custom-card-helpers'
import { type SeasonInfo, type ZoneInfo } from './dto/zone-info.dto'

export const heatgerGetZonesInfo = async (hass: HomeAssistant): Promise<Record<string, ZoneInfo>> => {
  return await hass.callWS<Record<string, ZoneInfo>>({ type: 'heatger_get_zones_info' })
}

export const heatgerGetSeason = async (hass: HomeAssistant): Promise<SeasonInfo> => {
  return await hass.callWS<SeasonInfo>({ type: 'heatger/season' })
}
