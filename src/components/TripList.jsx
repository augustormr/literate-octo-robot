import TripCard from './TripCard'

const STATUS_ORDER = { ongoing: 0, upcoming: 1, completed: 2 }

export default function TripList({ trips, filter, search, onUpdate, onDelete }) {
  const filtered = trips
    .filter(t => filter === 'all' || t.status === filter)
    .filter(t => {
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return (
        t.destination.toLowerCase().includes(q) ||
        (t.country ?? '').toLowerCase().includes(q) ||
        (t.notes ?? '').toLowerCase().includes(q)
      )
    })
    .sort((a, b) => {
      const statusDiff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
      if (statusDiff !== 0) return statusDiff
      return a.startDate.localeCompare(b.startDate)
    })

  if (filtered.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon">✈️</div>
        <p>
          {trips.length === 0
            ? 'No trips yet. Add your first trip!'
            : 'No trips match your filters.'}
        </p>
      </div>
    )
  }

  return (
    <div className="trip-list">
      {filtered.map(trip => (
        <TripCard
          key={trip.id}
          trip={trip}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
