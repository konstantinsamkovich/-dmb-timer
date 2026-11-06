import { useEffect, useMemo, useState } from 'react'
import Avatar from './components/Avatar.jsx'
import FriendCard from './components/FriendCard.jsx'
import PatientCard from './components/PatientCard.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import { friends, patients, waitingFriends } from './data/friends.js'
import { useTheme } from './hooks/useTheme.js'
import { DAY_MS, daysLabel, getServiceState } from './utils/serviceTime.js'
import './App.css'

function App() {
  const [now, setNow] = useState(() => Date.now())
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const tick = () => setNow(Date.now())
    const id = setInterval(tick, 1000)
    const handleVisibility = () => {
      if (!document.hidden) tick()
    }

    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  const { activeCount, nearest } = useMemo(() => {
    let active = 0
    let closest = null

    for (const friend of friends) {
      const state = getServiceState(friend, now)
      if (!state.started || state.ended) continue

      active += 1
      const daysLeft = Math.ceil(state.remaining / DAY_MS)
      if (!closest || daysLeft < closest.daysLeft) {
        closest = { daysLeft, name: friend.name.split(' ')[0] }
      }
    }

    return { activeCount: active, nearest: closest }
  }, [now])

  return (
    <div className="app">
      <ThemeToggle theme={theme} onToggle={toggleTheme} />

      <header className="hero">
        <p className="hero-badge">
          <span className="hero-badge-star" aria-hidden="true">
            ★
          </span>
          Служба идёт — считаем дни
        </p>

        <h1 className="hero-title">
          Ватрушный ДМБ <span>Таймер</span>
        </h1>

        <p className="hero-subtitle">
          Личный отсчёт до демобилизации для каждого, кто сейчас в строю.
          Каждая секунда — ближе к дому.
        </p>

        <div className="hero-stats">
          <div className="stat">
            <span className="stat-value">{friends.length}</span>
            <span className="stat-label">друга в списке</span>
          </div>
          <span className="stat-divider" aria-hidden="true" />
          <div className="stat">
            <span className="stat-value">{activeCount}</span>
            <span className="stat-label">сейчас в строю</span>
          </div>
          <span className="stat-divider" aria-hidden="true" />
          <div className="stat">
            <span className="stat-value">
              {nearest ? daysLabel(nearest.daysLeft) : '—'}
            </span>
            <span className="stat-label">
              {nearest ? `до ДМБ ${nearest.name}` : 'все уже дома'}
            </span>
          </div>
        </div>
      </header>

      <main className="friend-grid" aria-label="Друзья и их таймеры">
        {friends.map((friend, index) => (
          <FriendCard key={friend.id} friend={friend} now={now} index={index} />
        ))}
      </main>

      {patients.length > 0 && (
        <section className="patient" aria-labelledby="patient-title">
          <div className="waiting-head">
            <h2 className="waiting-title" id="patient-title">
              Пациент дурдома
            </h2>
            <p className="waiting-subtitle">
              Косит по дурке — точная дата выхода неизвестна
            </p>
          </div>

          <div className="patient-grid">
            {patients.map((patient, index) => (
              <PatientCard key={patient.id} patient={patient} now={now} index={index} />
            ))}
          </div>
        </section>
      )}

      <section className="waiting" aria-labelledby="waiting-title">
        <div className="waiting-head">
          <h2 className="waiting-title" id="waiting-title">
            Список пидорков
          </h2>
          <p className="waiting-subtitle">
            Не забрали в этот призыв — ждут повестки на март
          </p>
        </div>

        <div className="waiting-grid">
          {waitingFriends.map((friend) => (
            <article className="waiting-card" key={friend.id}>
              <Avatar name={friend.name} photo={friend.avatar} />
              <div className="waiting-identity">
                <h3 className="waiting-name">{friend.name}</h3>
                <span className="waiting-status">
                  <span className="waiting-dot" aria-hidden="true" />
                  {friend.status}
                </span>
                {friend.notes?.length > 0 && (
                  <ul className="waiting-notes">
                    {friend.notes.map((note) => (
                      <li className="waiting-note" key={note}>
                        {note}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <span className="footer-line" aria-hidden="true" />
        <p>
          <span className="footer-star" aria-hidden="true">
            ★
          </span>
          Возвращайтесь скорее — дома ждут
        </p>
        <p className="footer-note">Таймеры обновляются каждую секунду</p>
      </footer>
    </div>
  )
}

export default App
