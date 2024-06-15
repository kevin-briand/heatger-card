import { type HomeAssistant } from 'custom-card-helpers'

interface ApiResponse {
  success: boolean
}

export const heatgerActivateFrostfree = async (hass: HomeAssistant, endDate: Date): Promise<ApiResponse> => {
  return await hass.callApi<ApiResponse>('POST', 'heatger/frostfree/activate', { date: endDate })
}

export const heatgerDeactivateFrostfree = async (hass: HomeAssistant): Promise<ApiResponse> => {
  return await hass.callApi<ApiResponse>('POST', 'heatger/frostfree/deactivate')
}
