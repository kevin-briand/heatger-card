import { localize } from '../../localize/localize'

export const remainingTime = (nextChange: number, lang: string): string => {
  if (nextChange < 0) {
    return localize('card.never', lang)
  }

  const days = Math.floor(nextChange / (24 * 3600))
  const hours = Math.floor((nextChange % (24 * 3600)) / 3600)
  const minutes = Math.floor((nextChange % 3600) / 60)
  const remainingSeconds = Math.floor(nextChange % 60)

  let finalStrDate = ''
  if (days > 0) {
    finalStrDate += `${days}${localize('card.dayLetter', lang)} `
  }
  if (hours > 0) {
    finalStrDate += `${hours}h `
  }
  if (minutes > 0) {
    finalStrDate += `${minutes}m `
  }
  finalStrDate += `${remainingSeconds}s`
  return finalStrDate
}
