const avatarModules = import.meta.glob(
  '../assets/avatars/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true, import: 'default' },
)

const avatarAliases = {
  bober: ['bober', 'бобёр', 'бобер', 'бебер'],
  volodko: ['volodko', 'володько'],
  kostya: ['kostya', 'костя'],
  lepeshka: ['lepeshka', 'лепешка', 'лепёшка'],
  kovalev: ['kovalev', 'ковалев', 'ковалев димка', 'димка'],
  egor: ['egor', 'егор', 'егор пидорюга'],
  danik: ['danik', 'даник'],
}

function getAvatar(id) {
  const aliases = avatarAliases[id] ?? [id]
  const entry = Object.entries(avatarModules).find(([path]) => {
    const fileName = path
      .split('/')
      .pop()
      .replace(/\.[^.]+$/, '')
      .trim()
      .toLocaleLowerCase('ru')

    return aliases.includes(fileName)
  })

  return entry ? entry[1] : null
}

const friendList = [
  {
    id: 'bober',
    name: 'Бобёр',
    unit: 'Барановичи',
    startDate: '2026-10-27',
    endDate: '2027-10-27',
  },
  {
    id: 'volodko',
    name: 'Володько',
    unit: 'Брест',
    startDate: '2026-10-28',
    endDate: '2027-10-28',
  },
  {
    id: 'kostya',
    name: 'Костя',
    unit: '—',
    startDate: '2026-11-02',
    endDate: '2027-11-02',
  },
  {
    id: 'lepeshka',
    name: 'Лепешка',
    unit: '—',
    startDate: '2026-11-02',
    endDate: '2027-11-02',
  },
]

const waitingList = [
  {
    id: 'kovalev',
    name: 'Ковалев Димка',
  },
  {
    id: 'egor',
    name: 'Егор Пидорюга',
  },
]

const patientList = [
  {
    id: 'danik',
    name: 'Даник',
    startDate: '2026-10-22',
  },
]

export const friends = friendList.map((friend) => ({
  ...friend,
  avatar: getAvatar(friend.id),
}))

export const waitingFriends = waitingList.map((friend) => ({
  ...friend,
  avatar: getAvatar(friend.id),
}))

export const patients = patientList.map((patient) => ({
  ...patient,
  avatar: getAvatar(patient.id),
}))
