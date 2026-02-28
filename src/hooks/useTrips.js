import { useState, useEffect } from 'react'

const STORAGE_KEY = 'trip-manager-trips'

function computeStatus(startDate, endDate) {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const start = new Date(startDate)
  const end = new Date(endDate)
  if (end < now) return 'completed'
  if (start <= now) return 'ongoing'
  return 'upcoming'
}

export function useTrips() {
  const [trips, setTrips] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips))
  }, [trips])

  function addTrip(data) {
    const trip = {
      id: crypto.randomUUID(),
      ...data,
      status: computeStatus(data.startDate, data.endDate),
      createdAt: new Date().toISOString(),
    }
    setTrips(prev => [trip, ...prev])
    return trip
  }

  function updateTrip(id, data) {
    setTrips(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, ...data, status: computeStatus(data.startDate, data.endDate) }
          : t
      )
    )
  }

  function deleteTrip(id) {
    setTrips(prev => prev.filter(t => t.id !== id))
  }

  return { trips, addTrip, updateTrip, deleteTrip }
}
