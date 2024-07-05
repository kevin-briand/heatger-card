import { localize } from '../../localize/localize'

export const remainingTime = (nextChange: number, lang: string): string => {
  if (nextChange === -1) {
    return localize('card.never', lang)
  }
  const date = new Date(nextChange * 1000)
  date.setMilliseconds(0)
  if (date.getUTCDate() > 1 && date.getUTCDate() < 8) {
    return `${date.getUTCDate() - 1}${localize('card.dayLetter', lang)} ${date.getUTCHours()}h`
  }
  if (date.getUTCHours() > 0 && date.getUTCDate() === 1) {
    return `${date.getUTCHours()}h ${date.getUTCMinutes()}m`
  }
  return `${date.getUTCMinutes()}m  ${date.getUTCSeconds()}s`
}
