import { type State } from '../../enum/state'
import { type Mode } from '../../enum/mode'

export interface ZoneDto {
  id: string
  name: string
  state: State
  mode: Mode
  nextChange: Date
  isPing: boolean
}
