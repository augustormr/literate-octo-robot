import { Award, Plane, Hotel, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useLoyaltyPrograms } from '@/hooks/useTrips'

const typeIcons: Record<string, typeof Award> = {
  airline: Plane,
  hotel: Hotel,
  other: Star,
}

export default function LoyaltyPage() {
  const { data: programs = [], isLoading } = useLoyaltyPrograms()

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
        <h1 className="text-2xl font-bold tracking-tight">Loyalty Programs</h1>
        <p className="text-muted-foreground">
          Track your airline, hotel, and other loyalty memberships
        </p>
      </div>

      {programs.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => {
            const Icon = typeIcons[program.program_type] ?? Award
            return (
              <Card key={program.id}>
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">
                      {program.program_name}
                    </CardTitle>
                    <Badge variant="outline" className="text-xs capitalize">
                      {program.program_type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {program.membership_number && (
                    <p className="text-sm">
                      <span className="text-muted-foreground">Member #: </span>
                      {program.membership_number}
                    </p>
                  )}
                  {program.tier_status && (
                    <p className="text-sm">
                      <span className="text-muted-foreground">Tier: </span>
                      {program.tier_status}
                    </p>
                  )}
                  {program.notes && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {program.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Award className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-1 text-lg font-semibold">No loyalty programs</h3>
            <p className="text-muted-foreground">
              Your loyalty program memberships will appear here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
