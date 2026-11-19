import assert from 'node:assert/strict'
import test from 'node:test'
import { formatDateRu, getCountdown, getServiceState } from './serviceTime.js'

const friend = { id: 'example', startDate: '2026-10-26', endDate: '2027-10-26' }

test('service starts and ends at midnight in Minsk', () => {
  const start = Date.parse('2026-10-25T21:00:00Z')
  const end = Date.parse('2027-10-25T21:00:00Z')
  assert.equal(getServiceState(friend, start - 1).started, false)
  assert.equal(getServiceState(friend, start).started, true)
  assert.equal(getServiceState(friend, end - 1).ended, false)
  assert.equal(getServiceState(friend, end).ended, true)
  assert.equal(getServiceState(friend, end).percent, 100)
  assert.equal(formatDateRu(friend.endDate), '26 октября 2027')
})

test('countdown shows one second until the target is reached', () => {
  assert.deepEqual(getCountdown(1), { days: 0, hours: 0, minutes: 0, seconds: 1 })
  assert.deepEqual(getCountdown(0), { days: 0, hours: 0, minutes: 0, seconds: 0 })
})

test('invalid dates and reversed periods are rejected', () => {
  assert.throws(() => formatDateRu('2027-02-30'), RangeError)
  assert.throws(() => getServiceState({ ...friend, endDate: '2026-10-25' }, 0), RangeError)
})
