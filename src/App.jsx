import { useEffect, useMemo, useState } from 'react'
import FriendCard from './components/FriendCard.jsx'
import { friends } from './data/friends.js'
import { DAY_MS, daysLabel, getServiceState } from './utils/serviceTime.js'
import './App.css'

function App() {
  const [now, setNow] = useState(() => Date.now())

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
      if (state.ended) continue

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
      <header className="hero">
        <p className="hero-badge">
          <span className="hero-badge-star" aria-hidden="true">
            ★
          </span>
          Служба идёт — считаем дни
        </p>

        <h1 className="hero-title">
          ДМБ <span>Таймер</span>
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
