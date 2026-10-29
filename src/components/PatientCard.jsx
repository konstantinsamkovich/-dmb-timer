import Avatar from './Avatar.jsx'
import {
  daysLabel,
  daysWord,
  formatDateRu,
  getDaysSince,
} from '../utils/serviceTime.js'

function PatientCard({ patient, now, index }) {
  const days = getDaysSince(patient.startDate, now)

  return (
    <article
      className="friend-card patient-card"
      style={{ '--i': index }}
      aria-label={`${patient.name}: косит по дурке, в дурдоме ${daysLabel(days)}`}
    >
      <div className="card-avatar">
        <Avatar name={patient.name} photo={patient.avatar} />
      </div>

      <div className="card-panel">
        <header className="card-head">
          <div className="identity">
            <h2 className="friend-name">{patient.name}</h2>
            <p className="friend-unit">Дурдом</p>
          </div>
          <span className="status status-patient">
            <span className="status-dot" aria-hidden="true" />
            Косит по дурке
          </span>
        </header>

        <div
          className="patient-counter"
          aria-label={`${patient.name} находится в дурдоме ${daysLabel(days)}`}
        >
          <span className="patient-counter-value">{days}</span>
          <span className="patient-counter-unit">{daysWord(days)}</span>
          <span className="patient-counter-label">уже в дурдоме</span>
        </div>

        <footer className="dates">
          <div className="date-item">
            <span className="date-label">В дурдоме с</span>
            <span className="date-value">{formatDateRu(patient.startDate)}</span>
          </div>
          <div className="date-item">
            <span className="date-label">Дата выхода</span>
            <span className="date-value date-value-unknown">неизвестно</span>
          </div>
        </footer>
      </div>
    </article>
  )
}

export default PatientCard
