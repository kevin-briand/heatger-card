import { localize } from '../../localize/localize'

export const remainingTime = (nextChange: number, lang: string): string => {
  if (nextChange === -1) {
    return localize('card.never', lang)
  }
  const date = new Date((nextChange + new Date().getTimezoneOffset() * 60) * 1000)
  date.setMilliseconds(0)
  if (date.getDate() > 1 && date.getDate() < 8) {
    return `${date.getDate() - 1}${localize('card.dayLetter', lang)} ${date.getHours()}h`
  }
  if (date.getHours() > 0 && date.getDate() === 1) {
    return `${date.getHours()}h ${date.getMinutes()}m`
  }
  return `${date.getMinutes()}m  ${date.getSeconds()}s`
}
