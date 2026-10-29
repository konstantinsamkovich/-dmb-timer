import Avatar from './Avatar.jsx'
import {
  daysLabel,
  formatDateRu,
  getCountdown,
  getServiceState,
} from '../utils/serviceTime.js'

const pad = (value) => String(value).padStart(2, '0')

function FriendCard({ friend, now, index }) {
  const { ended, started, percent, remaining, untilStart } = getServiceState(friend, now)
  const upcoming = !started && !ended
  const countdown = getCountdown(upcoming ? untilStart : remaining)
  const progressPercent = ended ? 100 : Math.min(99.999, percent)
  const displayPercent = progressPercent.toFixed(3)

  const cells = [
    { value: String(countdown.days), label: 'дней' },
    { value: pad(countdown.hours), label: 'часов' },
    { value: pad(countdown.minutes), label: 'минут' },
    { value: pad(countdown.seconds), label: 'секунд' },
  ]

  const timerLabel = ended
    ? 'Служба завершена'
    : `${upcoming ? 'До призыва' : 'До демобилизации'} осталось ${daysLabel(countdown.days)}, ${countdown.hours} ч ${countdown.minutes} мин ${countdown.seconds} с`

  const statusText = ended ? 'ДМБ!' : upcoming ? 'Ждёт призыва' : 'На службе'
  const statusClass = ended ? ' status-done' : upcoming ? ' status-upcoming' : ''
  const cardClass = ended ? ' is-done' : upcoming ? ' is-upcoming' : ''
  const ariaState = ended ? 'служба завершена' : upcoming ? 'ждёт призыва' : 'до демобилизации'
  const progressLabel = ended
    ? 'Служба завершена'
    : upcoming
      ? 'Служба ещё не началась'
      : 'Служба пройдена'

  return (
    <article
      className={`friend-card${cardClass}`}
      style={{ '--i': index }}
      aria-label={`${friend.name}: ${ariaState}`}
    >
      <div className="card-avatar">
        <Avatar name={friend.name} photo={friend.avatar} />
      </div>

      <div className="card-panel">
        <header className="card-head">
          <div className="identity">
            <h2 className="friend-name">{friend.name}</h2>
            <p className="friend-unit">{friend.unit}</p>
          </div>
          <span className={`status${statusClass}`}>
            <span className="status-dot" aria-hidden="true" />
            {statusText}
          </span>
        </header>

        {ended ? (
          <div className="demob">
            <span className="demob-word">ДМБ!</span>
            <p className="demob-sub">Служба завершена · добро пожаловать домой</p>
          </div>
        ) : (
          <div className="countdown" role="timer" aria-live="off" aria-label={timerLabel}>
            {cells.map((cell) => (
              <div className="time-cell" key={cell.label}>
                <span className="time-value">{cell.value}</span>
                <span className="time-label">{cell.label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="progress-block">
          <div className="progress-meta">
            <span>{progressLabel}</span>
            <span className="progress-value">{displayPercent}%</span>
          </div>
          <div
            className="progress-track"
            role="progressbar"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={progressPercent}
            aria-label={`Прогресс службы ${friend.name}`}
          >
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <footer className="dates">
          <div className="date-item">
            <span className="date-label">Призыв</span>
            <span className="date-value">{formatDateRu(friend.startDate)}</span>
          </div>
          <div className="date-item">
            <span className="date-label">Демобилизация</span>
            <span className="date-value">{formatDateRu(friend.endDate)}</span>
          </div>
        </footer>
      </div>
    </article>
  )
}

export default FriendCard
