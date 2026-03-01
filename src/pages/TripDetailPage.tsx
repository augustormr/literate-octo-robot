import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import {
  ArrowLeft,
  Plane,
  Hotel,
  UtensilsCrossed,
  Car,
  Edit,
  Trash2,
  Plus,
  Clock,
  MapPin,
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import TripForm from '@/components/trips/TripForm'
import { useTripDetail, useUpdateTrip, useDeleteTrip } from '@/hooks/useTrips'

const statusStyles: Record<string, string> = {
  ongoing: 'bg-green-500 text-white',
  upcoming: 'bg-blue-500 text-white',
  completed: 'bg-slate-500 text-white',
}

export default function TripDetailPage() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const { data: trip, isLoading } = useTripDetail(tripId)
  const updateTrip = useUpdateTrip()
  const deleteTrip = useDeleteTrip()
  const [editing, setEditing] = useState(false)

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="mb-4 text-muted-foreground">Trip not found</p>
        <Button variant="outline" asChild>
          <Link to="/trips">Back to Trips</Link>
        </Button>
      </div>
    )
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      deleteTrip.mutate(trip.id, {
        onSuccess: () => navigate('/trips'),
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/trips">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            {trip.color && (
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: trip.color }}
              />
            )}
            <h1 className="text-2xl font-bold">{trip.name}</h1>
            <Badge className={statusStyles[trip.status] ?? ''}>
              {trip.status}
            </Badge>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {(trip.destination_city || trip.destination_country) && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {[trip.destination_city, trip.destination_country]
                  .filter(Boolean)
                  .join(', ')}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {format(parseISO(trip.start_date), 'MMM d')} -{' '}
              {format(parseISO(trip.end_date), 'MMM d, yyyy')}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            <Edit className="mr-1 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={handleDelete}>
            <Trash2 className="mr-1 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {trip.notes && (
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">{trip.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Detail tabs */}
      <Tabs defaultValue="flights">
        <TabsList>
          <TabsTrigger value="flights" className="gap-1.5">
            <Plane className="h-3.5 w-3.5" />
            Flights ({trip.flights.length})
          </TabsTrigger>
          <TabsTrigger value="hotels" className="gap-1.5">
            <Hotel className="h-3.5 w-3.5" />
            Hotels ({trip.hotels.length})
          </TabsTrigger>
          <TabsTrigger value="restaurants" className="gap-1.5">
            <UtensilsCrossed className="h-3.5 w-3.5" />
            Restaurants ({trip.restaurants.length})
          </TabsTrigger>
          <TabsTrigger value="transport" className="gap-1.5">
            <Car className="h-3.5 w-3.5" />
            Transport ({trip.transports.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flights" className="mt-4 space-y-3">
          {trip.flights.length === 0 ? (
            <EmptySection label="flights" />
          ) : (
            trip.flights.map((flight) => (
              <Card key={flight.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">
                        {flight.flight_number}
                        {flight.airline && (
                          <span className="ml-2 text-sm font-normal text-muted-foreground">
                            {flight.airline}
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {flight.departure_airport} → {flight.arrival_airport}
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      <p>{format(parseISO(flight.departure_time), 'MMM d, HH:mm')}</p>
                      {flight.duration_minutes && (
                        <p className="text-muted-foreground">
                          {Math.floor(flight.duration_minutes / 60)}h{' '}
                          {flight.duration_minutes % 60}m
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="hotels" className="mt-4 space-y-3">
          {trip.hotels.length === 0 ? (
            <EmptySection label="hotels" />
          ) : (
            trip.hotels.map((hotel) => (
              <Card key={hotel.id}>
                <CardContent className="p-4">
                  <p className="font-semibold">{hotel.name}</p>
                  {hotel.city && (
                    <p className="text-sm text-muted-foreground">
                      {[hotel.city, hotel.country].filter(Boolean).join(', ')}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-muted-foreground">
                    {format(parseISO(hotel.check_in), 'MMM d')} -{' '}
                    {format(parseISO(hotel.check_out), 'MMM d, yyyy')}
                  </p>
                  {hotel.rating && (
                    <p className="mt-1 text-sm">
                      {'★'.repeat(hotel.rating)}{'☆'.repeat(5 - hotel.rating)}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="restaurants" className="mt-4 space-y-3">
          {trip.restaurants.length === 0 ? (
            <EmptySection label="restaurants" />
          ) : (
            trip.restaurants.map((restaurant) => (
              <Card key={restaurant.id}>
                <CardContent className="p-4">
                  <p className="font-semibold">{restaurant.name}</p>
                  {restaurant.city && (
                    <p className="text-sm text-muted-foreground">
                      {[restaurant.city, restaurant.country].filter(Boolean).join(', ')}
                    </p>
                  )}
                  {restaurant.reservation_date && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {format(parseISO(restaurant.reservation_date), 'MMM d, yyyy')}
                      {restaurant.reservation_time && ` at ${restaurant.reservation_time}`}
                    </p>
                  )}
                  {restaurant.rating && (
                    <p className="mt-1 text-sm">
                      {'★'.repeat(restaurant.rating)}{'☆'.repeat(5 - restaurant.rating)}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="transport" className="mt-4 space-y-3">
          {trip.transports.length === 0 ? (
            <EmptySection label="transport" />
          ) : (
            trip.transports.map((transport) => (
              <Card key={transport.id}>
                <CardContent className="p-4">
                  <p className="font-semibold">{transport.name}</p>
                  {transport.pickup_location && (
                    <p className="text-sm text-muted-foreground">
                      {transport.pickup_location}
                      {transport.dropoff_location && ` → ${transport.dropoff_location}`}
                    </p>
                  )}
                  {transport.pickup_time && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {format(parseISO(transport.pickup_time), 'MMM d, HH:mm')}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Edit dialog */}
      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Trip</DialogTitle>
          </DialogHeader>
          <TripForm
            initialData={trip}
            onSubmit={(data) => {
              updateTrip.mutate(
                { id: trip.id, ...data },
                { onSuccess: () => setEditing(false) }
              )
            }}
            onCancel={() => setEditing(false)}
            submitting={updateTrip.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function EmptySection({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8">
      <p className="mb-2 text-sm text-muted-foreground">No {label} added yet</p>
    </div>
  )
}
