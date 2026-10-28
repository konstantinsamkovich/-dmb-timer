import { useRef, useState } from 'react'

const STORAGE_PREFIX = 'dmb-avatar:'
const AVATAR_SIZE = 256

function readStoredAvatar(id) {
  try {
    return localStorage.getItem(STORAGE_PREFIX + id)
  } catch {
    return null
  }
}

function getInitials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
}

function resizeImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const image = new Image()

      image.onload = () => {
        const side = Math.min(image.width, image.height)
        const canvas = document.createElement('canvas')
        canvas.width = AVATAR_SIZE
        canvas.height = AVATAR_SIZE

        const context = canvas.getContext('2d')
        context.drawImage(
          image,
          (image.width - side) / 2,
          (image.height - side) / 2,
          side,
          side,
          0,
          0,
          AVATAR_SIZE,
          AVATAR_SIZE,
        )

        resolve(canvas.toDataURL('image/jpeg', 0.85))
      }

      image.onerror = reject
      image.src = reader.result
    }

    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function Avatar({ id, name, photo, className = '' }) {
  const [storedSrc, setStoredSrc] = useState(() => readStoredAvatar(id))
  const src = storedSrc ?? photo ?? null
  const inputRef = useRef(null)

  const pickPhoto = () => inputRef.current?.click()

  const handleFile = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    try {
      const dataUrl = await resizeImage(file)
      setStoredSrc(dataUrl)
      localStorage.setItem(STORAGE_PREFIX + id, dataUrl)
    } catch {
      return
    }
  }

  return (
    <div className={`avatar-slot ${className}`.trim()}>
      <button
        type="button"
        className="avatar"
        onClick={pickPhoto}
        aria-label={`${name}: выбрать фото`}
        title="Нажмите, чтобы поставить фото"
      >
        {src ? (
          <img className="avatar-img" src={src} alt={name} />
        ) : (
          <span className="avatar-initials" aria-hidden="true">
            {getInitials(name)}
          </span>
        )}
        <span className="avatar-edit" aria-hidden="true">
          +
        </span>
      </button>
      <input
        ref={inputRef}
        className="avatar-input"
        type="file"
        accept="image/*"
        onChange={handleFile}
        tabIndex={-1}
      />
    </div>
  )
}

export default Avatar
