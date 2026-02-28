export default function TripStats({ trips }) {
  const upcoming = trips.filter(t => t.status === 'upcoming').length
  const ongoing = trips.filter(t => t.status === 'ongoing').length
  const completed = trips.filter(t => t.status === 'completed').length

  const destinations = new Set(trips.map(t => t.destination.toLowerCase())).size

  const totalBudget = trips
    .filter(t => t.budget && t.currency === 'USD')
    .reduce((sum, t) => sum + t.budget, 0)

  return (
    <div className="stats-bar">
      <div className="stat">
        <span className="stat__value">{trips.length}</span>
        <span className="stat__label">Total trips</span>
      </div>
      <div className="stat">
        <span className="stat__value stat__value--upcoming">{upcoming}</span>
        <span className="stat__label">Upcoming</span>
      </div>
      <div className="stat">
        <span className="stat__value stat__value--ongoing">{ongoing}</span>
        <span className="stat__label">Ongoing</span>
      </div>
      <div className="stat">
        <span className="stat__value stat__value--completed">{completed}</span>
        <span className="stat__label">Completed</span>
      </div>
      <div className="stat">
        <span className="stat__value">{destinations}</span>
        <span className="stat__label">Destinations</span>
      </div>
      {totalBudget > 0 && (
        <div className="stat">
          <span className="stat__value">${totalBudget.toLocaleString()}</span>
          <span className="stat__label">USD budget</span>
        </div>
      )}
    </div>
  )
}
