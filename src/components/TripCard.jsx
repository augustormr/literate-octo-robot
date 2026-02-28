import { useState } from 'react'
import TripForm from './TripForm'

const STATUS_LABEL = { upcoming: 'Upcoming', ongoing: 'Ongoing', completed: 'Completed' }

function formatDate(d) {
  if (!d) return '—'
  return new Date(d + 'T00:00:00').toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

function daysDiff(startDate, endDate) {
  const s = new Date(startDate)
  const e = new Date(endDate)
  return Math.round((e - s) / (1000 * 60 * 60 * 24))
}

function daysUntil(startDate) {
  const now = new Date(); now.setHours(0, 0, 0, 0)
  const s = new Date(startDate)
  return Math.round((s - now) / (1000 * 60 * 60 * 24))
}

export default function TripCard({ trip, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const duration = daysDiff(trip.startDate, trip.endDate)
  const until = trip.status === 'upcoming' ? daysUntil(trip.startDate) : null

  function handleUpdate(data) {
    onUpdate(trip.id, data)
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="trip-card trip-card--editing">
        <div className="trip-card__edit-header">
          <h3>Edit Trip</h3>
        </div>
        <TripForm
          initial={{
            destination: trip.destination,
            country: trip.country ?? '',
            startDate: trip.startDate,
            endDate: trip.endDate,
            budget: trip.budget ?? '',
            currency: trip.currency ?? 'USD',
            notes: trip.notes ?? '',
          }}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
        />
      </div>
    )
  }

  return (
    <div className={`trip-card trip-card--${trip.status}`}>
      <div className="trip-card__header">
        <div>
          <h3 className="trip-card__destination">{trip.destination}</h3>
          {trip.country && <span className="trip-card__country">{trip.country}</span>}
        </div>
        <span className={`status-badge status-badge--${trip.status}`}>
          {STATUS_LABEL[trip.status]}
        </span>
      </div>

      <div className="trip-card__dates">
        <span>{formatDate(trip.startDate)}</span>
        <span className="trip-card__arrow">→</span>
        <span>{formatDate(trip.endDate)}</span>
        <span className="trip-card__duration">({duration} day{duration !== 1 ? 's' : ''})</span>
      </div>

      {until !== null && (
        <div className="trip-card__countdown">
          {until === 0 ? 'Starts today!' : until === 1 ? 'Starts tomorrow!' : `${until} days away`}
        </div>
      )}

      {trip.budget && (
        <div className="trip-card__budget">
          Budget: <strong>{trip.currency} {trip.budget.toLocaleString()}</strong>
        </div>
      )}

      {trip.notes && (
        <p className="trip-card__notes">{trip.notes}</p>
      )}

      <div className="trip-card__actions">
        <button className="btn btn-sm btn-ghost" onClick={() => setEditing(true)}>Edit</button>
        {confirmDelete ? (
          <>
            <span className="delete-confirm-text">Delete?</span>
            <button className="btn btn-sm btn-danger" onClick={() => onDelete(trip.id)}>Yes</button>
            <button className="btn btn-sm btn-ghost" onClick={() => setConfirmDelete(false)}>No</button>
          </>
        ) : (
          <button className="btn btn-sm btn-ghost btn-ghost--danger" onClick={() => setConfirmDelete(true)}>Delete</button>
        )}
      </div>
    </div>
  )
}
