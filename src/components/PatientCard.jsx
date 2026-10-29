import Avatar from './Avatar.jsx'

const cells = [
  { label: 'дней' },
  { label: 'часов' },
  { label: 'минут' },
  { label: 'секунд' },
]

function PatientCard({ patient, index }) {
  return (
    <article
      className="friend-card patient-card"
      style={{ '--i': index }}
      aria-label={`${patient.name}: косит по дурке`}
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
          className="countdown countdown-unknown"
          role="group"
          aria-label="Время выхода из дурдома неизвестно"
        >
          {cells.map((cell) => (
            <div className="time-cell" key={cell.label}>
              <span className="time-value time-value-unknown">неизвестно</span>
              <span className="time-label">{cell.label}</span>
            </div>
          ))}
        </div>

        <footer className="dates">
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
