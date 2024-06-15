import { type HomeAssistant } from 'custom-card-helpers'
import { type ZoneInfo } from './dto/zone-info.dto'

export const heatgerGetZonesInfo = async (hass: HomeAssistant): Promise<Record<string, ZoneInfo>> => {
  return await hass.callWS<Record<string, ZoneInfo>>({ type: 'heatger_get_zones_info' })
}

export const heatgerGetFrostfreeInfo = async (hass: HomeAssistant): Promise<number> => {
  return await hass.callWS<number>({ type: 'heatger_get_frostfree_info' })
}
