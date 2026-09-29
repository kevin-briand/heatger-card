import { type State } from '../../../enum/state'
import { type Mode } from '../../../enum/mode'

export interface ZoneInfo {
  id: string
  number: number
  name: string
  state: State
  mode: Mode
  nextSwitch: number
  nextChange: string | null
  isPing: boolean
  override: { state: State, until: string | null } | null
}

export type SeasonKey = 'heating' | 'cooling' | 'stop'

export interface SeasonInfo {
  season: SeasonKey
  until: string | null
  next: SeasonKey
  remaining: number
}
