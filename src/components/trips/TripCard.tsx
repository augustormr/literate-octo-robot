import { Link } from 'react-router-dom'
import { Calendar, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Trip } from '@/types'
import { format, parseISO } from 'date-fns'

const statusStyles: Record<string, string> = {
  ongoing: 'bg-green-500 text-white',
  upcoming: 'bg-blue-500 text-white',
  completed: 'bg-slate-500 text-white',
}

export default function TripCard({ trip }: { trip: Trip }) {
  return (
    <Link to={`/trips/${trip.id}`}>
      <Card className="group transition-all hover:shadow-md">
        {trip.color && (
          <div className="h-1.5 rounded-t-lg" style={{ backgroundColor: trip.color }} />
        )}
        <CardContent className="p-4">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="font-semibold group-hover:text-primary">{trip.name}</h3>
            <Badge className={statusStyles[trip.status] ?? statusStyles.completed}>
              {trip.status}
            </Badge>
          </div>

          {(trip.destination_city || trip.destination_country) && (
            <div className="mb-2 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {[trip.destination_city, trip.destination_country]
                .filter(Boolean)
                .join(', ')}
            </div>
          )}

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {format(parseISO(trip.start_date), 'MMM d')} -{' '}
            {format(parseISO(trip.end_date), 'MMM d, yyyy')}
          </div>

          {trip.notes && (
            <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
              {trip.notes}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
