import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plane, Hotel, MapPin, Calendar, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useTrips } from '@/hooks/useTrips'
import { format, isPast, isFuture, isToday, parseISO } from 'date-fns'

export default function DashboardPage() {
  const { data: trips = [], isLoading } = useTrips()

  const stats = useMemo(() => {
    const now = new Date()
    const ongoing = trips.filter(
      (t) => !isPast(parseISO(t.end_date)) && !isFuture(parseISO(t.start_date))
    )
    const upcoming = trips.filter((t) => isFuture(parseISO(t.start_date)))
    const completed = trips.filter((t) => isPast(parseISO(t.end_date)))
    const countries = new Set(trips.map((t) => t.country_code).filter(Boolean))

    return { ongoing, upcoming, completed, totalCountries: countries.size, total: trips.length }
  }, [trips])

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Your travel overview at a glance</p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Trips"
          value={stats.total}
          icon={<Plane className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Countries Visited"
          value={stats.totalCountries}
          icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Upcoming"
          value={stats.upcoming.length}
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Ongoing"
          value={stats.ongoing.length}
          icon={<Hotel className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      {/* Ongoing trips */}
      {stats.ongoing.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Currently Traveling</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.ongoing.map((trip) => (
              <TripSummaryCard key={trip.id} trip={trip} statusLabel="Ongoing" statusColor="bg-green-500" />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming trips */}
      {stats.upcoming.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Upcoming Trips</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/trips">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.upcoming.slice(0, 3).map((trip) => (
              <TripSummaryCard key={trip.id} trip={trip} statusLabel="Upcoming" statusColor="bg-blue-500" />
            ))}
          </div>
        </section>
      )}

      {/* Recent trips */}
      {stats.completed.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Trips</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/trips">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.completed.slice(0, 3).map((trip) => (
              <TripSummaryCard key={trip.id} trip={trip} statusLabel="Completed" statusColor="bg-slate-500" />
            ))}
          </div>
        </section>
      )}

      {trips.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Plane className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-1 text-lg font-semibold">No trips yet</h3>
            <p className="mb-4 text-muted-foreground">
              Start tracking your travels by adding your first trip.
            </p>
            <Button asChild>
              <Link to="/trips">Add Trip</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string
  value: number
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  )
}

function TripSummaryCard({
  trip,
  statusLabel,
  statusColor,
}: {
  trip: { id: string; name: string; start_date: string; end_date: string; destination_city: string | null; destination_country: string | null; color: string | null }
  statusLabel: string
  statusColor: string
}) {
  return (
    <Link to={`/trips/${trip.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <Badge
              variant="secondary"
              className={`text-xs text-white ${statusColor}`}
            >
              {statusLabel}
            </Badge>
            {trip.color && (
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: trip.color }}
              />
            )}
          </div>
          <h3 className="font-semibold">{trip.name}</h3>
          {(trip.destination_city || trip.destination_country) && (
            <p className="text-sm text-muted-foreground">
              {[trip.destination_city, trip.destination_country]
                .filter(Boolean)
                .join(', ')}
            </p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            {format(parseISO(trip.start_date), 'MMM d')} -{' '}
            {format(parseISO(trip.end_date), 'MMM d, yyyy')}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
