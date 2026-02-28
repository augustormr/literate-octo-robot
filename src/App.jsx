import { useState } from 'react'
import { useTrips } from './hooks/useTrips'
import TripForm from './components/TripForm'
import TripList from './components/TripList'
import TripStats from './components/TripStats'

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
]

export default function App() {
  const { trips, addTrip, updateTrip, deleteTrip } = useTrips()
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  function handleAdd(data) {
    addTrip(data)
    setShowForm(false)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__inner">
          <div className="app-header__brand">
            <span className="app-header__logo">✈</span>
            <h1>Trip Manager</h1>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(v => !v)}>
            {showForm ? 'Cancel' : '+ New Trip'}
          </button>
        </div>
      </header>

      <main className="app-main">
        {showForm && (
          <section className="section">
            <h2 className="section__title">New Trip</h2>
            <TripForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
          </section>
        )}

        {trips.length > 0 && (
          <TripStats trips={trips} />
        )}

        <section className="section">
          <div className="toolbar">
            <div className="filter-tabs">
              {FILTERS.map(f => (
                <button
                  key={f.value}
                  className={`filter-tab ${filter === f.value ? 'filter-tab--active' : ''}`}
                  onClick={() => setFilter(f.value)}
                >
                  {f.label}
                  <span className="filter-tab__count">
                    {f.value === 'all'
                      ? trips.length
                      : trips.filter(t => t.status === f.value).length}
                  </span>
                </button>
              ))}
            </div>
            <input
              className="search-input"
              type="search"
              placeholder="Search trips..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <TripList
            trips={trips}
            filter={filter}
            search={search}
            onUpdate={updateTrip}
            onDelete={deleteTrip}
          />
        </section>
      </main>
    </div>
  )
}
