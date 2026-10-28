import Avatar from './Avatar.jsx'
import {
  daysLabel,
  formatDateRu,
  getCountdown,
  getServiceState,
} from '../utils/serviceTime.js'

const pad = (value) => String(value).padStart(2, '0')

function FriendCard({ friend, now, index }) {
  const { ended, percent, remaining } = getServiceState(friend, now)
  const countdown = getCountdown(remaining)
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
    : `До демобилизации осталось ${daysLabel(countdown.days)}, ${countdown.hours} ч ${countdown.minutes} мин ${countdown.seconds} с`

  return (
    <article
      className={`friend-card${ended ? ' is-done' : ''}`}
      style={{ '--i': index }}
      aria-label={`${friend.name}: ${ended ? 'служба завершена' : 'до демобилизации'}`}
    >
      <header className="card-head">
        <Avatar id={friend.id} name={friend.name} photo={friend.avatar} />
        <div className="identity">
          <h2 className="friend-name">{friend.name}</h2>
          <p className="friend-unit">{friend.unit}</p>
        </div>
        <span className={`status${ended ? ' status-done' : ''}`}>
          <span className="status-dot" aria-hidden="true" />
          {ended ? 'ДМБ!' : 'На службе'}
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
          <span>{ended ? 'Служба завершена' : 'Служба пройдена'}</span>
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
    </article>
  )
}

export default FriendCard
