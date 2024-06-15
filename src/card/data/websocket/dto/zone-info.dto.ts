import { type State } from '../../../enum/state'
import { type Mode } from '../../../enum/mode'

export interface ZoneInfo {
  name: string
  state: State
  mode: Mode
  nextSwitch: number
  isPing: boolean
}
