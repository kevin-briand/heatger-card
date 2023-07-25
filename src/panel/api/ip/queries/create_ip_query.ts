import { HeatgerBackend } from '../../heatger_backend'
import { type HomeAssistant } from 'custom-card-helpers'
import { type IpDto } from '../dto/ip_dto'

export async function createIpQuery (hass: HomeAssistant, ip: IpDto): Promise<IpDto[]> {
  const api = await HeatgerBackend.build(hass)
  return await api.post<IpDto[]>('ip', ip).then(r => r.data)
}
