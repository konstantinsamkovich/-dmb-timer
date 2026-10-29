function getInitials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
}

function Avatar({ name, photo }) {
  return (
    <div className="avatar-slot">
      <div className="avatar">
        {photo ? (
          <img className="avatar-img" src={photo} alt={name} />
        ) : (
          <span className="avatar-initials" aria-hidden="true">
            {getInitials(name)}
          </span>
        )}
      </div>
    </div>
  )
}

export default Avatar
