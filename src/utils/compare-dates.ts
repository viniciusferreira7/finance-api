import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(isBetween)

interface CompareDatesParams {
  date: Date
  from?: string
  to?: string
}

export function compareDates({ date, from, to }: CompareDatesParams) {
  const compareDate = dayjs(date).startOf('day')

  const startDate = from ? dayjs(from).startOf('day') : null
  const endDate = to ? dayjs(to).endOf('day') : null

  const isItToGetASpecificDate = startDate && !endDate

  if (isItToGetASpecificDate) {
    return compareDate.isSame(startDate, 'milliseconds')
  }

  const isToGetRangeOfDates = startDate && endDate

  if (isToGetRangeOfDates) {
    return compareDate.isBetween(startDate, endDate)
  }

  if (!startDate && !endDate) {
    return true
  }
}
