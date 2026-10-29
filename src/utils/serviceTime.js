export const DAY_MS = 24 * 60 * 60 * 1000

const MONTHS = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
]

function parseDate(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function formatDateRu(isoDate) {
  const date = parseDate(isoDate)
  const day = String(date.getDate()).padStart(2, '0')
  return `${day} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

export function getDaysSince(isoDate, now) {
  const start = parseDate(isoDate).getTime()
  return Math.max(0, Math.floor((now - start) / DAY_MS))
}

export function getServiceState(friend, now) {
  const start = parseDate(friend.startDate).getTime()
  const end = parseDate(friend.endDate).getTime()
  const total = end - start
  const remaining = end - now
  const untilStart = start - now
  const started = now >= start
  const ended = remaining <= 0

  let percent = 0
  if (ended) {
    percent = 100
  } else if (started && total > 0) {
    percent = Math.min(100, ((now - start) / total) * 100)
  }

  return {
    start,
    end,
    total,
    remaining: Math.max(0, remaining),
    untilStart: Math.max(0, untilStart),
    started,
    ended,
    percent,
  }
}

export function getCountdown(remainingMs) {
  const totalSeconds = Math.floor(remainingMs / 1000)

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}

function pluralize(value, forms) {
  const mod10 = value % 10
  const mod100 = value % 100

  if (mod10 === 1 && mod100 !== 11) return forms[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1]
  return forms[2]
}

export function daysWord(value) {
  return pluralize(value, ['день', 'дня', 'дней'])
}

export function daysLabel(value) {
  return `${value} ${daysWord(value)}`
}
