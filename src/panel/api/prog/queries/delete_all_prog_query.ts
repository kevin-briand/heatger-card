import { HeatgerBackend } from '../../heatger_backend'
import { type HomeAssistant } from 'custom-card-helpers'
import { type Prog } from '../dto/prog'

export async function deleteAllProgQuery (hass: HomeAssistant, zoneNumber: number): Promise<Prog[]> {
  const api = await HeatgerBackend.build(hass)
  const URL = `prog/zone${zoneNumber}`
  return await api.delete<Prog[]>(URL).then(r => r.data)
}
