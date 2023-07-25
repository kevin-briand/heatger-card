import { HeatgerBackend } from '../../heatger_backend'
import { type HomeAssistant } from 'custom-card-helpers'
import { type IpDto } from '../dto/ip_dto'

export async function deleteIpQuery (hass: HomeAssistant, ip: IpDto): Promise<IpDto[]> {
  const api = await HeatgerBackend.build(hass)
  const URL = `ip/${ip.ip}`
  return await api.delete<IpDto[]>(URL).then(r => r.data)
}
