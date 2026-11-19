export const DAY_MS = 24 * 60 * 60 * 1000
const MINSK_OFFSET_MS = 3 * 60 * 60 * 1000

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
  const date = new Date(`${isoDate}T00:00:00Z`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)
    || !Number.isFinite(date.getTime())
    || date.toISOString().slice(0, 10) !== isoDate) {
    throw new RangeError(`Некорректная дата: ${isoDate}`)
  }
  return date
}

export function formatDateRu(isoDate) {
  const date = parseDate(isoDate)
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${day} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`
}

export function getDaysSince(isoDate, now) {
  const start = parseDate(isoDate).getTime() - MINSK_OFFSET_MS
  return Math.max(0, Math.floor((now - start) / DAY_MS))
}

export function getServiceState(friend, now) {
  const start = parseDate(friend.startDate).getTime() - MINSK_OFFSET_MS
  const end = parseDate(friend.endDate).getTime() - MINSK_OFFSET_MS
  const total = end - start
  if (total <= 0) {
    throw new RangeError(`${friend.id}: дата ДМБ должна быть позже даты призыва`)
  }
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
  const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000))

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
